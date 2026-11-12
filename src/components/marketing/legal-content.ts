import { CITY, RULES } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";

/**
 * Legal documents, ported from the legacy prototype (legacy/login.js LEGAL_DOCS).
 * Figures come from RULES so they can't drift (the legacy copy said "1-month free trial";
 * the business rule is RULES.freeTrialMonths). Plain text only, never rendered as HTML.
 */

export type LegalSection = { id: string; heading: string; body: string[] };
export type LegalDoc = {
  slug: LegalSlug;
  title: string;
  short: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
};

export const LEGAL_SLUGS = ["terms", "provider", "protection", "privacy"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

const UPDATED = "2026-11-01";

const TEST_MODE =
  "While Servhive is in its pilot, payments run in test mode: no real money moves and no card is charged. When live payments open, escrowed funds will be held by a licensed payment partner, not in Servhive's company accounts.";

export const LEGAL_DOCS: Record<LegalSlug, LegalDoc> = {
  terms: {
    slug: "terms",
    title: "Terms of Use",
    short: "Terms",
    summary: "The ground rules for everyone using Servhive, whether you're hiring or working.",
    updated: UPDATED,
    sections: [
      {
        id: "agreement",
        heading: "Agreement to terms",
        body: [
          "By accessing or using the Servhive platform, whether as a customer seeking services or as a registered provider, you agree to comply with and be bound by these Terms of Use.",
        ],
      },
      {
        id: "marketplace",
        heading: `${CITY} service marketplace`,
        body: [
          `Servhive connects residents and businesses across ${CITY} with verified artisans and technicians. We provide transparent rate discovery, private in-app messaging and payment protection through escrow.`,
          TEST_MODE,
        ],
      },
      {
        id: "scope-and-price",
        heading: "Scope and price agreement",
        body: [
          "Agree the price in the app before the job starts. Changing the price on site after arrival is prohibited.",
          "Payments for jobs found on Servhive must go through Servhive. Asking for, or making, direct cash or bank payments to get around escrow is a breach of these terms and may lead to suspension.",
        ],
      },
      {
        id: "payment-protection",
        heading: "Payment protection",
        body: [
          `Payment is held in escrow and released after you confirm the job is done, or automatically ${RULES.autoReleaseHours} hours after the provider marks it complete if no problem is reported.`,
        ],
      },
      {
        id: "disputes",
        heading: "Dispute resolution",
        body: [
          `Problems must be reported within ${RULES.disputeWindowHours} hours of the job being marked complete. Opening a dispute freezes the payment. Servhive will review the case and communicate a decision, release or refund, within ${RULES.disputeDecisionDays} days.`,
        ],
      },
    ],
  },

  provider: {
    slug: "provider",
    title: "Provider Agreement",
    short: "Provider",
    summary: "What artisans agree to when they list on Servhive: review, fees, commission and boosts.",
    updated: UPDATED,
    sections: [
      {
        id: "eligibility",
        heading: "Provider eligibility and review",
        body: [
          'All newly registered providers start as "Under review". Profiles appear in public search, with a verified badge, only after approval by the Servhive team following identity checks.',
          `Applicants must provide a government-issued ID and at least ${RULES.minWorkPhotosForReview} photos of their own work. Regulated trades must also provide a valid professional licence.`,
        ],
      },
      {
        id: "subscription",
        heading: `Membership and ${RULES.freeTrialMonths}-month free trial`,
        body: [
          `Every new provider receives a ${RULES.freeTrialMonths}-month free trial. After that, a membership fee of ${formatNaira(RULES.monthlySubscription)} per month applies to all providers, paid before the month ends. If unpaid, the profile is hidden from ${CITY} search until payment is made.`,
        ],
      },
      {
        id: "commission",
        heading: `Platform commission (${RULES.commissionPct}%)`,
        body: [
          `A ${RULES.commissionPct}% commission applies to jobs paid through the app. The customer pays no extra fee for payment protection; the ${RULES.commissionPct}% is deducted from the provider's payout when the job is released.`,
        ],
      },
      {
        id: "boost",
        heading: `Profile boost (${formatNaira(RULES.boostPricePerWeek)} / week)`,
        body: [
          `Providers may optionally boost their profile to appear at the top of ${CITY} search results for their trade at a flat rate of ${formatNaira(RULES.boostPricePerWeek)} per week.`,
        ],
      },
      {
        id: "conduct",
        heading: "Conduct",
        body: [
          "Providers must not ask clients to pay outside the app, change agreed prices on site, or share a client's details. Breaches can lead to suspension and removal of the profile.",
        ],
      },
    ],
  },

  protection: {
    slug: "protection",
    title: "Payment Protection Terms",
    short: "Protection",
    summary: "How escrow holds your money, when it releases and what it costs you (nothing).",
    updated: UPDATED,
    sections: [
      {
        id: "escrow",
        heading: "Escrow holding",
        body: [
          "When you fund a job, the payment is held in escrow and released only after you confirm the job is done. The provider can see that funds are secured but cannot withdraw them early.",
          TEST_MODE,
        ],
      },
      {
        id: "auto-release",
        heading: `${RULES.autoReleaseHours}-hour auto-release`,
        body: [
          `If the customer does not release the payment or report an issue within ${RULES.autoReleaseHours} hours of the job being marked complete, the payment is released to the provider automatically.`,
        ],
      },
      {
        id: "disputes",
        heading: "Disputes and refunds",
        body: [
          `Reporting a problem within ${RULES.disputeWindowHours} hours freezes the payment. An admin reviews both sides and decides within ${RULES.disputeDecisionDays} days to release the funds to the provider or refund them to the customer.`,
        ],
      },
      {
        id: "fees",
        heading: "No extra customer fees",
        body: [
          "Payment protection is included with every in-app booking at no additional charge to the customer.",
          "Payments made outside Servhive are not protected and cannot be recovered through escrow.",
        ],
      },
    ],
  },

  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    short: "Privacy",
    summary: "What we collect, what stays private and what is never published.",
    updated: UPDATED,
    sections: [
      {
        id: "contact-privacy",
        heading: "Contact privacy",
        body: [
          "Servhive keeps phone numbers off public listings. Customers and artisans talk through in-app messaging, which protects both sides from unsolicited contact and harassment.",
        ],
      },
      {
        id: "identity-documents",
        heading: "Identity document protection",
        body: [
          "Government ID and licence documents uploaded by artisans are stored privately, solely for compliance and background checks. They are never published.",
        ],
      },
      {
        id: "messages",
        heading: "Messages and safety checks",
        body: [
          "Messages may be checked automatically for attempts to move payment off the platform, and reviewed by our team when a dispute or report is raised.",
        ],
      },
    ],
  },
};

export function isLegalSlug(s: string): s is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(s);
}
