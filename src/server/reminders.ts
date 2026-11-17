import "server-only";
import { db } from "@/lib/db";
import { RULES } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";
import { sendEmail } from "@/server/notifications/email";
import { autoReleaseDueJobs } from "@/server/escrow";
import type { ReminderKind } from "@/generated/prisma/client";

/**
 * Scheduled reminder sweeps (A.6 auto-release, A.8 subscription). Designed to be
 * run on a timer by /api/cron. Idempotent: every send is logged in SentReminder
 * (unique on kind+subject) so a reminder goes out at most once, even if cron
 * fires more often or overlaps.
 *
 * Email-only for now; recipients are resolved from the related user/provider.
 */

const HOUR = 3_600_000;
const DAY = 86_400_000;

type Sweep = { kind: ReminderKind; subject: string; to: string | null; subjectLine: string; text: string };

/** Claim a reminder's send slot. Returns true if WE should send it (first claim wins). */
async function claim(kind: ReminderKind, subject: string): Promise<boolean> {
  try {
    await db.sentReminder.create({ data: { kind, subject } });
    return true;
  } catch {
    // Unique violation → already sent (or claimed by a concurrent run).
    return false;
  }
}

async function dispatch(s: Sweep): Promise<"sent" | "skipped" | "failed"> {
  if (!s.to) return "skipped";
  if (!(await claim(s.kind, s.subject))) return "skipped";
  const res = await sendEmail({ to: s.to, subject: s.subjectLine, text: s.text });
  if (res.ok) return "sent";
  // Un-claim on a hard failure (not a "skipped"/unconfigured no-op) so a later run can retry.
  if (!res.skipped) {
    await db.sentReminder.deleteMany({ where: { kind: s.kind, subject: s.subject } }).catch(() => {});
    return "failed";
  }
  return "skipped";
}

// ── Auto-release reminders (client side) ─────────────────────────────────────

/**
 * Jobs in the AWAITING_RELEASE window get two nudges to the client:
 *   - AUTO_RELEASE_24H  once we're within ~24h of auto-release
 *   - AUTO_RELEASE_SOON once we're within ~3h of auto-release
 * so they can confirm or dispute before the money moves automatically.
 */
async function autoReleaseReminders() {
  const now = Date.now();
  const windowMs = RULES.autoReleaseHours * HOUR;
  const jobs = await db.escrowJob.findMany({
    where: { status: "AWAITING_RELEASE", markedCompleteAt: { not: null } },
    select: {
      id: true,
      ref: true,
      serviceName: true,
      amount: true,
      markedCompleteAt: true,
      client: { select: { email: true, name: true } },
      provider: { select: { businessName: true } },
    },
  });

  const sweeps: Sweep[] = [];
  for (const j of jobs) {
    const releaseAt = j.markedCompleteAt!.getTime() + windowMs;
    const msLeft = releaseAt - now;
    if (msLeft <= 0) continue; // past due — autoReleaseDueJobs() handles the release itself
    const hoursLeft = Math.ceil(msLeft / HOUR);

    const base = {
      to: j.client.email,
      amount: j.amount,
      provider: j.provider.businessName,
      service: j.serviceName,
      ref: j.ref,
      name: j.client.name,
    };

    if (msLeft <= 3 * HOUR) {
      sweeps.push({
        kind: "AUTO_RELEASE_SOON",
        subject: j.id,
        to: base.to,
        subjectLine: `Final reminder: ${formatNaira(base.amount)} releases to ${base.provider} soon`,
        text: autoReleaseBody(base, hoursLeft, true),
      });
    } else if (msLeft <= 24 * HOUR) {
      sweeps.push({
        kind: "AUTO_RELEASE_24H",
        subject: j.id,
        to: base.to,
        subjectLine: `Reminder: confirm your job with ${base.provider} within ~24h`,
        text: autoReleaseBody(base, hoursLeft, false),
      });
    }
  }
  return runAll(sweeps);
}

function autoReleaseBody(
  b: { name: string; amount: number; provider: string; service: string; ref: string },
  hoursLeft: number,
  soon: boolean,
) {
  return [
    `Hi ${b.name},`,
    "",
    `${b.provider} marked your job "${b.service}" (${b.ref}) as complete.`,
    soon
      ? `Your payment of ${formatNaira(b.amount)} will be released to them automatically in about ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}.`
      : `Unless you confirm or report a problem, your payment of ${formatNaira(b.amount)} will be released to them automatically in about ${hoursLeft} hours (${RULES.autoReleaseHours}h after completion).`,
    "",
    "If the work is done, you can release the payment now. If something's wrong, open a dispute from your account before the window closes — a dispute freezes the money until it's resolved.",
    "",
    "Open your jobs: /account/jobs",
    "",
    "— Servhive",
  ].join("\n");
}

// ── Subscription reminders (provider side) ───────────────────────────────────

/**
 * Providers get a 7-day and a 3-day heads-up before their trial/subscription
 * coverage ends, so they can pay before the profile is hidden from search (A.8).
 * The subject embeds the coverage-end day, so next period's reminders are a new
 * key and fire again.
 */
async function subscriptionReminders() {
  const now = Date.now();
  const soonCutoff = new Date(now + 8 * DAY); // only load providers ending within ~8 days
  const providers = await db.provider.findMany({
    where: {
      status: { in: ["APPROVED", "UNDER_REVIEW", "DRAFT"] },
      OR: [
        { subscriptionPaidUntil: { gt: new Date(now), lte: soonCutoff } },
        { AND: [{ subscriptionPaidUntil: null }, { trialEndsAt: { gt: new Date(now), lte: soonCutoff } }] },
      ],
    },
    select: {
      id: true,
      businessName: true,
      trialEndsAt: true,
      subscriptionPaidUntil: true,
      user: { select: { email: true, name: true } },
    },
  });

  const sweeps: Sweep[] = [];
  for (const p of providers) {
    const coveredUntil = (p.subscriptionPaidUntil ?? p.trialEndsAt)?.getTime();
    if (!coveredUntil) continue;
    const daysLeft = Math.ceil((coveredUntil - now) / DAY);
    const period = new Date(coveredUntil).toISOString().slice(0, 10); // dedup per coverage end
    const onTrial = !p.subscriptionPaidUntil;

    const common = { to: p.user?.email ?? null, name: p.user?.name ?? p.businessName, onTrial };

    if (daysLeft <= 3 && daysLeft >= 1) {
      sweeps.push({
        kind: "SUBSCRIPTION_3D",
        subject: `${p.id}:${period}`,
        to: common.to,
        subjectLine: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left — pay to keep your Servhive profile live`,
        text: subscriptionBody(common.name, daysLeft, common.onTrial),
      });
    } else if (daysLeft <= 7 && daysLeft > 3) {
      sweeps.push({
        kind: "SUBSCRIPTION_7D",
        subject: `${p.id}:${period}`,
        to: common.to,
        subjectLine: `Your Servhive membership renews in ${daysLeft} days`,
        text: subscriptionBody(common.name, daysLeft, common.onTrial),
      });
    }
  }
  return runAll(sweeps);
}

function subscriptionBody(name: string, daysLeft: number, onTrial: boolean) {
  return [
    `Hi ${name},`,
    "",
    onTrial
      ? `Your free trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`
      : `Your Servhive membership is due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`,
    `To keep your profile visible in Port Harcourt search, pay the ${formatNaira(RULES.monthlySubscription)} monthly membership before it ends. If it lapses, your profile is hidden from search until you pay — your account and data stay safe.`,
    "",
    "Pay now: /pro/billing",
    "",
    "— Servhive",
  ].join("\n");
}

// ── Orchestration ────────────────────────────────────────────────────────────

async function runAll(sweeps: Sweep[]) {
  let sent = 0,
    skipped = 0,
    failed = 0;
  for (const s of sweeps) {
    const r = await dispatch(s);
    if (r === "sent") sent++;
    else if (r === "failed") failed++;
    else skipped++;
  }
  return { sent, skipped, failed };
}

/** Full sweep for the cron job: release due escrow, then send both reminder sets. */
export async function runReminderSweeps() {
  // Release anything already past the window first, so we never remind on a job
  // that's about to be auto-released this same tick.
  await autoReleaseDueJobs();
  const autoRelease = await autoReleaseReminders();
  const subscription = await subscriptionReminders();
  return { autoRelease, subscription };
}
