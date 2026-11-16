import { CITY, RULES } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";

/**
 * Legal documents — paste-ready text supplied by Godfrey Unite (Nov 2026),
 * "Servhive: Legal Page Text for the Builder".
 *
 * Rules:
 *  - Keep [square brackets] exactly as written. They are filled in before publishing
 *    (company name/RC, address, emails, retention period…) and must NOT be published
 *    with the brackets still in place.
 *  - Figures that mirror a business rule come from RULES so copy and behaviour can't
 *    drift (free trial months, commission %, auto-release/dispute windows, fees).
 *  - PILOT_NOTICE shows at the top of every page during the pilot. Remove it only once
 *    the lawyer has approved the text (see legal page component).
 *  - The TEST_MODE sentence stays until real payments are live, then it is deleted
 *    (A.11). It is gated by the PAYMENTS_LIVE flag in the legal page component.
 *  - Plain text only — never rendered as HTML.
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

/** Set "Updated" to the day the page is published. */
const UPDATED = "2026-11-16";

/** Shown at the top of every legal page during the pilot. Remove when the lawyer approves. */
export const PILOT_NOTICE = "Pilot terms. These apply during the Servhive pilot and may change.";

/**
 * Sentence kept until real payments are live, then removed (A.11). Rendered only
 * while PAYMENTS_LIVE is off — see the legal page component.
 */
export const TEST_MODE =
  "While Servhive is in its pilot, payments run in test mode: no real money moves and no card is charged. When live payments open, the funds will be held by a licensed payment partner, not in Servhive's company accounts. [Confirm the exact wording with the lawyer and Paystack.]";

export const LEGAL_DOCS: Record<LegalSlug, LegalDoc> = {
  // ── Page 1: Terms of Use ───────────────────────────────────────────────────
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
          "By creating an account or using Servhive, whether as a customer or a provider, you agree to these Terms of Use. If you do not agree, please do not use Servhive.",
        ],
      },
      {
        id: "who-we-are",
        heading: "Who we are and who can use Servhive",
        body: [
          `Servhive is run by [company name and RC number], [address], ${CITY}, Nigeria ("Servhive", "we"). You must be at least 18 years old. You must give accurate information and keep your login private. You are responsible for what happens under your account.`,
        ],
      },
      {
        id: "platform-not-provider",
        heading: "Servhive is a platform, not the service provider",
        body: [
          `Servhive connects customers with independent providers in ${CITY}. Providers are not our employees or agents. When you book a provider, your agreement for the work is with that provider. We do not do the work and we cannot promise that any provider will do it well, on time or at the quoted price. We check each provider's identity and, for regulated trades, their licence. A check does not guarantee the quality of the work.`,
        ],
      },
      {
        id: "scope-and-price",
        heading: "Scope and price agreement",
        body: [
          "Agree the price in the app before the job starts. Changing the price on site after arrival is not allowed. Payments for jobs found on Servhive must go through Servhive. Asking for, or making, direct cash or bank payments to get around payment protection is a breach of these terms and may lead to suspension.",
        ],
      },
      {
        id: "payment-protection",
        heading: "Payment protection",
        body: [
          "Payments made in the app are held and released as set out in the Payment Protection Terms. Payments made outside the app are not protected.",
        ],
      },
      {
        id: "not-allowed",
        heading: "What is not allowed",
        body: [
          "You must not use Servhive to request or offer anything illegal, harass or threaten anyone, share another person's contact details, post false reviews, or try to avoid the app's payment or safety features. To protect children, Servhive does not list nanny, babysitting, childcare, daycare or private tutoring services.",
        ],
      },
      {
        id: "reviews",
        heading: "Reviews",
        body: [
          "Only customers who have paid for a job in the app can review it. Reviews must be honest. We may remove reviews that are false, abusive or unrelated to the work.",
        ],
      },
      {
        id: "contact-privacy",
        heading: "Contact privacy and message checks",
        body: [
          "Phone numbers are kept off public listings, and customers and providers talk through in-app messages. Messages may be checked automatically for attempts to move payment off the platform, and reviewed by our team when a report or dispute is raised.",
        ],
      },
      {
        id: "suspension",
        heading: "Suspension",
        body: [
          "We may suspend or close an account if these terms are broken, if we suspect fraud, or if the law requires it.",
        ],
      },
      {
        id: "responsibility",
        heading: "Our responsibility",
        body: [
          "We are responsible for our own failures to the extent the law allows. We are not responsible for a provider's work, or for loss or damage caused by a provider or by events outside our control. Nothing in these terms removes any right you have under Nigerian law that cannot be removed. [Lawyer to review this section.]",
        ],
      },
      {
        id: "complaints",
        heading: "Complaints and disputes",
        body: [
          `For a problem with a job, report it within ${RULES.disputeWindowHours} hours of the job being marked complete (see the Payment Protection Terms). For anything else, contact [support email]. We aim to reply within [3] working days. If a dispute cannot be settled, the parties will first try mediation.`,
        ],
      },
      {
        id: "governing-law",
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of the Federal Republic of Nigeria. The courts of Rivers State have jurisdiction, without removing any right you have to go to a consumer protection regulator.",
        ],
      },
      {
        id: "changes",
        heading: "Changes",
        body: [
          "We may update these terms. We will tell you about important changes in the app. If you keep using Servhive after a change, you accept it.",
        ],
      },
    ],
  },

  // ── Page 2: Provider Agreement ─────────────────────────────────────────────
  provider: {
    slug: "provider",
    title: "Provider Agreement",
    short: "Provider",
    summary: "What artisans agree to when they list on Servhive: review, fees, commission and boosts.",
    updated: UPDATED,
    sections: [
      {
        id: "joining",
        heading: "Joining and review",
        body: [
          'You may join if you are at least 18 and offer a service in an allowed category. Services involving unsupervised care of children (nanny, babysitting, childcare, daycare, private tutoring) are not allowed. All new providers start as "Under review". Your profile appears in public search, with a verified badge, only after the Servhive team approves it. We may approve, reject, hide or remove any provider.',
        ],
      },
      {
        id: "verification",
        heading: "Verification",
        body: [
          `You must provide a valid government ID (NIN slip, driver's licence, voter's card or international passport), at least ${RULES.minWorkPhotosForReview} photos of your own work, and your phone number. If you work in a regulated trade (Home Health Aide, Laser Tech and Electrologist, Tattoo and Body Piercer, Funeral Director), you must also upload a valid licence or registration. You confirm that everything you submit is true and yours. Tell us if a licence expires or is withdrawn. We may check again at any time.`,
        ],
      },
      {
        id: "membership",
        heading: `Membership and ${RULES.freeTrialMonths}-month free trial`,
        body: [
          `Every new provider receives a ${RULES.freeTrialMonths}-month free trial. After that, a membership fee of ${formatNaira(RULES.monthlySubscription)} per month applies to all providers, paid before the month ends. If it is not paid, your profile is hidden from ${CITY} search until payment is made. We may change fees with at least [30] days' notice. [Confirm how VAT and other taxes apply.]`,
        ],
      },
      {
        id: "commission",
        heading: `Platform commission (${RULES.commissionPct}%)`,
        body: [
          `A ${RULES.commissionPct}% commission applies to jobs paid through the app. The customer pays no extra fee for payment protection. The ${RULES.commissionPct}% is taken from your payout when the job is released.`,
        ],
      },
      {
        id: "boost",
        heading: `Profile boost (${formatNaira(RULES.boostPricePerWeek)} per week)`,
        body: [
          `You may choose to boost your profile to appear at the top of ${CITY} search results for your trade, for a flat ${formatNaira(RULES.boostPricePerWeek)} per week. Boosted listings are labelled.`,
        ],
      },
      {
        id: "payouts",
        heading: "Payouts",
        body: [
          `Payment for a job is released to you after the customer confirms the work, or automatically ${RULES.autoReleaseHours} hours after you mark the job complete if no problem is reported (see the Payment Protection Terms). Payouts go to the bank account you register, and the account name must match your ID. You are responsible for giving correct details.`,
        ],
      },
      {
        id: "independent",
        heading: "You are independent",
        body: [
          "You run your own business. You set your quotes, use your own tools and pay your own taxes. Nothing here makes you an employee, partner or agent of Servhive.",
        ],
      },
      {
        id: "quality",
        heading: "Quality and honesty",
        body: [
          "Give one honest fixed quote and keep to it unless the customer agrees to a change in the app. Do the work with reasonable skill and care, follow the safety rules for your trade, and arrive when you say you will. Do not ask for extra money outside the agreed price.",
        ],
      },
      {
        id: "conduct",
        heading: "Conduct",
        body: [
          "Do not ask customers to pay outside the app, change agreed prices on site, or share a customer's details. If you do, we may suspend or remove your profile and keep any unpaid fees.",
        ],
      },
      {
        id: "profile-and-photos",
        heading: "Your profile and photos",
        body: [
          "You keep ownership of your photos and text. You allow Servhive to show them on the platform. Only upload content you have the right to use. Do not upload photos of work you did not do.",
        ],
      },
      {
        id: "customer-information",
        heading: "Customer information",
        body: [
          "Use customer information only to do the job. Do not keep it for marketing, share it or sell it.",
        ],
      },
      {
        id: "reviews-and-complaints",
        heading: "Reviews and complaints",
        body: [
          "Customers can review and report you. We may use reports, messages and photos to decide a dispute, and may suspend your profile while we look into a serious complaint.",
        ],
      },
      {
        id: "ending",
        heading: "Ending",
        body: [
          "You may close your account at any time. We may suspend or remove you for breaking this agreement, fraud, repeated complaints, a lost licence or unpaid fees. Jobs already paid for must still be completed or refunded.",
        ],
      },
      {
        id: "responsibility",
        heading: "Responsibility",
        body: [
          "You are responsible for your work, for injury or damage you cause, and for any insurance your trade needs. You will cover reasonable losses Servhive suffers because you broke this agreement or the law. [Lawyer to review this section.]",
        ],
      },
      {
        id: "governing-law",
        heading: "Governing law",
        body: [
          "Nigerian law governs this agreement. The courts of Rivers State have jurisdiction, after the parties have first tried mediation.",
        ],
      },
    ],
  },

  // ── Page 3: Payment Protection Terms ───────────────────────────────────────
  protection: {
    slug: "protection",
    title: "Payment Protection Terms",
    short: "Payment Protection",
    summary: "How payment protection holds your money, when it releases and what it costs you (nothing).",
    updated: UPDATED,
    sections: [
      {
        id: "what-it-is",
        heading: "What it is",
        body: [
          "When you fund a job in the app, the money is held and released only as set out below. It applies only to jobs booked and paid through Servhive.",
        ],
      },
      {
        id: "how-held",
        heading: "How the money is held",
        body: [
          "The provider can see that the money is secured but cannot withdraw it early.",
          TEST_MODE,
        ],
      },
      {
        id: "how-paid",
        heading: "How a job is paid",
        body: [
          "1. The customer asks for a quote. Nothing is charged.",
          "2. The provider replies with one fixed price, and the customer accepts it.",
          "3. The customer pays the quoted amount.",
          "4. The provider does the work and marks the job complete in the app, with photos.",
          `5. The customer confirms, and the money is released to the provider, less the ${RULES.commissionPct}% commission.`,
        ],
      },
      {
        id: "auto-release",
        heading: `${RULES.autoReleaseHours}-hour auto-release`,
        body: [
          `If the customer does not release the payment or report a problem within ${RULES.autoReleaseHours} hours of the job being marked complete, the payment is released to the provider automatically. We will send reminders before this happens.`,
        ],
      },
      {
        id: "disputes",
        heading: "Disputes and refunds",
        body: [
          `Report a problem within ${RULES.disputeWindowHours} hours of the job being marked complete. The money is frozen and cannot auto-release. Explain what happened in the app, and the provider can respond. A Servhive admin reviews both sides and decides within ${RULES.disputeDecisionDays} working days to release the funds to the provider, refund them to the customer, or split them fairly. Both sides must answer our questions quickly. Approved refunds go back to the original payment method, which can take [5–10] working days.`,
        ],
      },
      {
        id: "cancelling",
        heading: "Cancelling",
        body: [
          "Before you pay, you can cancel freely. After the job is funded, cancelling goes through a dispute so both sides are heard.",
        ],
      },
      {
        id: "not-covered",
        heading: "What it does not cover",
        body: [
          "Payment protection is not insurance and does not guarantee the quality of any work. It covers only the amount paid through the app for that job. It does not cover injury, loss of property or damage beyond that amount. Payments made outside Servhive are not protected and cannot be recovered through this service.",
        ],
      },
      {
        id: "no-extra-fees",
        heading: "No extra customer fees",
        body: [
          `Payment protection is included with every in-app booking at no extra charge to the customer. Servhive's ${RULES.commissionPct}% commission is taken from the provider's payout. [Decide who bears the payment processor's charges.]`,
        ],
      },
      {
        id: "misuse",
        heading: "Misuse",
        body: [
          "If someone uses payment protection to cheat, such as a false complaint or a false completion, we may reverse a decision, withhold funds and close the account.",
        ],
      },
    ],
  },

  // ── Page 4: Privacy Policy ─────────────────────────────────────────────────
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    short: "Privacy",
    summary: "What we collect, what stays private and what is never published.",
    updated: UPDATED,
    sections: [
      {
        id: "responsible",
        heading: "Who is responsible for your data",
        body: [
          `[Company name and RC number], [address], ${CITY}, is responsible for your personal data. Contact us at [privacy email]. [Data protection officer: name and email, if required.] We follow the Nigeria Data Protection Act 2023.`,
        ],
      },
      {
        id: "what-we-collect",
        heading: "What we collect",
        body: [
          "Everyone: name, phone number, email if given, area, account activity, messages sent through the app, and device and log information.",
          "Providers: ID document details, photos of your work, licence or registration details, business name and services, and bank account details for payouts.",
          "Payments: payments are handled by our payment partner. We do not store full card details.",
        ],
      },
      {
        id: "why-we-use-it",
        heading: "Why we use it",
        body: [
          "To create accounts and run quotes, bookings and payments.",
          "To verify providers and keep people safe.",
          "To handle reports and disputes.",
          "To send codes, receipts and important notices.",
          "To prevent fraud and improve the app.",
          "To send promotions, only if you agree. You can say no at any time.",
        ],
      },
      {
        id: "contact-privacy",
        heading: "Contact privacy",
        body: [
          "Servhive keeps phone numbers off public listings. Customers and providers talk through in-app messages, which protects both sides from unwanted contact. A provider sees only what is needed to do a job, such as a first name and area, until a booking is made.",
        ],
      },
      {
        id: "identity-documents",
        heading: "Identity document protection",
        body: [
          "Government ID and licence documents uploaded by providers are stored privately, only for checks. They are never published or shown to customers, and only authorised staff can open them. [Describe storage and access.]",
        ],
      },
      {
        id: "messages",
        heading: "Messages and safety checks",
        body: [
          "Messages may be checked automatically for attempts to move payment off the platform, and reviewed by our team when a report or dispute is raised.",
        ],
      },
      {
        id: "sharing",
        heading: "Who we share data with",
        body: [
          "Customers see a provider's public profile. We share data with companies that help us run Servhive, such as our payment partner, SMS and verification services and hosting companies, and they may use it only for that purpose. We may also share data with the police, courts or regulators when the law requires it. We do not sell your personal data.",
        ],
      },
      {
        id: "where-kept",
        heading: "Where data is kept",
        body: [
          "Some of our service providers may keep data outside Nigeria. If so, we take the steps the law requires to protect it.",
        ],
      },
      {
        id: "how-long",
        heading: "How long we keep it",
        body: [
          "We keep account data while your account is active. We keep transaction, dispute and verification records for [6] years or as long as the law or a dispute requires, then delete or anonymise them. [Confirm with the lawyer.]",
        ],
      },
      {
        id: "security",
        heading: "Security",
        body: [
          "We use reasonable technical and organisational measures to protect your data. No system is perfectly secure. If a breach affects your rights, we will tell you and the Nigeria Data Protection Commission as the law requires.",
        ],
      },
      {
        id: "your-rights",
        heading: "Your rights",
        body: [
          "You may ask to see your data, correct it, delete it, limit or object to how we use it, take a copy of it, or withdraw consent you have given. Contact [privacy email]. You may also complain to the Nigeria Data Protection Commission.",
        ],
      },
      {
        id: "children",
        heading: "Children",
        body: [
          "Servhive is for people aged 18 and over. We do not knowingly collect data from children. If you think a child has an account, contact us and we will remove it.",
        ],
      },
      {
        id: "cookies",
        heading: "Cookies",
        body: [
          "We use cookies and similar tools to keep you signed in and understand how the app is used. [List them, and add a way to manage them if you use analytics or ads.]",
        ],
      },
      {
        id: "changes",
        heading: "Changes",
        body: [
          "We will post changes in the app and tell you directly about important ones.",
        ],
      },
    ],
  },
};

export function isLegalSlug(s: string): s is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(s);
}
