import "server-only";
import { db } from "@/lib/db";
import { RULES } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";
import { sendEmail } from "@/server/notifications/email";

/**
 * Transactional emails to the artisan about their escrow jobs. Best-effort: a
 * failure is logged by the email layer and swallowed, so it never breaks the
 * funding flow. Email-only for now (SMS stub exists for later).
 *
 * Wording note: while payments are in pilot/test mode, funds aren't really
 * collected yet, so the copy says "secured in escrow (test mode)" until
 * PAYMENTS_LIVE is set, matching the legal pages. It flips automatically.
 */

function paymentsLive() {
  return process.env.PAYMENTS_LIVE === "true" || process.env.PAYMENTS_LIVE === "1";
}

/**
 * Tell the artisan a client has funded a new job into escrow — their cue to do
 * the work. Called right after a job is created (quote accepted or service
 * booked). Takes the just-created job's id so it reads fresh, related data.
 */
export async function notifyArtisanJobFunded(jobId: string) {
  const job = await db.escrowJob.findUnique({
    where: { id: jobId },
    select: {
      ref: true,
      serviceName: true,
      amount: true,
      payoutAmount: true,
      area: true,
      address: true,
      scheduledFor: true,
      client: { select: { name: true } },
      provider: { select: { businessName: true, user: { select: { email: true, name: true } } } },
    },
  });
  if (!job) return;

  const to = job.provider.user?.email;
  if (!to) return; // provider has no email on file — nothing to send

  const live = paymentsLive();
  const held = live ? "is now secured in escrow" : "is now secured in escrow (test mode — no real money has moved yet)";
  const when = job.scheduledFor
    ? job.scheduledFor.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    : "To be arranged with the client";

  const subject = `New job funded: ${job.serviceName} (${job.ref})`;
  const text = [
    `Hi ${job.provider.user?.name ?? job.provider.businessName},`,
    "",
    `${job.client.name} has booked you for "${job.serviceName}", and the payment ${held}.`,
    "",
    `Job ref:    ${job.ref}`,
    `Amount:     ${formatNaira(job.amount)} (you receive ${formatNaira(job.payoutAmount)}: no commission)`,
    `Where:      ${job.address}, ${job.area}`,
    `When:       ${when}`,
    "",
    "What happens next:",
    `1. Do the work and mark it complete in the app, with photos.`,
    `2. The client confirms — or the payment releases to you automatically ${RULES.autoReleaseHours} hours after you mark it done if there's no dispute.`,
    "",
    "Open your jobs: /pro/jobs",
    "",
    "Remember: keep everything on Servhive. Taking payment outside the app isn't protected and can get your profile suspended.",
    "",
    "— Servhive",
  ].join("\n");

  await sendEmail({ to, subject, text });
}
