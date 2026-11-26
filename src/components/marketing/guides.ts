import { RULES } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";

/**
 * Plain-text guide content shared by the website (/how-it-works, /for-pros)
 * and the mobile app (via /api/v1/content), so both always say the same thing.
 * Figures come from RULES so copy and behaviour can't drift.
 */

export type GuideStep = { title: string; body: string; status: string | null };
export type FaqEntry = { q: string; a: string };

/** How a job runs, from the client's side (/how-it-works). */
export const CLIENT_STEPS: readonly GuideStep[] = [
  {
    title: "Request a quote",
    body: "Pick an artisan and describe the job, your area and when you need it. Nothing is charged. Some pros also list fixed-price services you can book straight away.",
    status: "PENDING",
  },
  {
    title: "The artisan quotes",
    body: "They reply with one fixed price. Accept it, or cancel and ask someone else. You can cancel any time before you pay.",
    status: "QUOTED",
  },
  {
    title: "You fund escrow",
    body: "Pay the quoted amount into escrow. Servhive holds it. The artisan can see it's secured, so they turn up ready to work.",
    status: "FUNDED",
  },
  {
    title: "The work gets done",
    body: "The artisan finishes and marks the job complete in the app. That starts a clock on your side.",
    status: "AWAITING_RELEASE",
  },
  {
    title: "You release, or it releases itself",
    body: `Happy with it? Release the payment. If you do nothing for ${RULES.autoReleaseHours} hours after completion, it releases automatically.`,
    status: "RELEASED",
  },
  {
    title: "Leave a review",
    body: "Only paid jobs can be reviewed, so every rating on Servhive comes from real work.",
    status: null,
  },
];

/** "When something goes wrong" (/how-it-works). */
export const CLIENT_DISPUTE_STEPS: readonly string[] = [
  `Open a dispute within ${RULES.disputeWindowHours} hours of the artisan marking the job complete. The money freezes and can't auto-release.`,
  "Explain what happened in the app. The artisan gets a chance to respond.",
  `An admin reviews both sides and decides within ${RULES.disputeDecisionDays} days: release to the artisan, or refund to you.`,
];

/** Client questions (/how-it-works). */
export const CLIENT_FAQ: readonly FaqEntry[] = [
  {
    q: "The artisan wants me to pay cash or transfer directly. Should I?",
    a: "No. Money paid outside Servhive isn't held in escrow and we can't help you get it back. Decline, and report the request from the artisan's profile.",
  },
  {
    q: "When exactly does auto-release happen?",
    a: `${RULES.autoReleaseHours} hours after the artisan marks the job complete, unless you release it earlier or open a dispute first.`,
  },
  {
    q: "Do I pay any fee on top of the quote?",
    a: "No. You pay the quoted price, and the artisan receives all of it. Servhive takes no commission.",
  },
  {
    q: "What happens to my money during a dispute?",
    a: `It stays frozen in escrow. Nobody can release it until an admin decides, within ${RULES.disputeDecisionDays} days, to pay the artisan or refund you.`,
  },
  {
    q: "Can I cancel after paying?",
    a: "Once escrow is funded, cancelling goes through a dispute so both sides are heard. Before that, cancel freely from your dashboard.",
  },
  {
    q: "Is real money moving yet?",
    a: "Not yet. Payments run in test mode while we connect our licensed payment partner. No card is charged.",
  },
];

/** Why artisans join (/for-pros, "Why join"). */
export const PRO_BENEFITS: readonly { title: string; body: string }[] = [
  {
    title: "The money is there first",
    body: "Clients fund escrow before you start. When they release it, you’re paid. No more chasing balances after the job.",
  },
  {
    title: "Requests, not window-shoppers",
    body: "Every request comes with the job, the area and the timing. You reply with one fixed quote.",
  },
  {
    title: "A profile that sells for you",
    body: "Your work photos, services and prices, plus reviews that can only come from paid jobs.",
  },
  {
    title: "Found where you work",
    body: "Clients search by neighbourhood, from GRA to Woji to Choba. Show up for the areas you cover.",
  },
];

/** Artisan pricing (/for-pros, "Pricing"). */
export const PRO_PRICING: readonly { k: string; v: string; note: string }[] = [
  {
    k: "Free trial",
    v: `${RULES.freeTrialMonths} ${RULES.freeTrialMonths === 1 ? "month" : "months"}`,
    note: `For the first ${RULES.freeTrialSlots} artisans to join. Full access, no card needed.`,
  },
  {
    k: "Membership",
    v: `${formatNaira(RULES.monthlySubscription)}/mo`,
    note: `After the free month, or from the start once the first ${RULES.freeTrialSlots} spots are taken. Keeps your profile visible in search.`,
  },
  { k: "Your earnings", v: "100%", note: "No commission. Every naira of the quote is yours when the job is released." },
  {
    k: "Boost",
    v: `${formatNaira(RULES.boostPricePerWeek)}/wk`,
    note: "Optional. Puts you at the top of your trade in search for a week.",
  },
];
