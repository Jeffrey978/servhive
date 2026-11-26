import { LEGAL_DOCS, LEGAL_SLUGS, PILOT_NOTICE, TEST_MODE } from "@/components/marketing/legal-content";
import { CLIENT_DISPUTE_STEPS, CLIENT_FAQ, CLIENT_STEPS, PRO_BENEFITS, PRO_PRICING } from "@/components/marketing/guides";
import { handler } from "@/server/api/http";

export const dynamic = "force-dynamic";

const PAYMENTS_LIVE = process.env.PAYMENTS_LIVE === "true" || process.env.PAYMENTS_LIVE === "1";

/**
 * The guides and legal pages for the mobile app's in-app sheets: the same text
 * the website shows (/how-it-works, /for-pros, /legal/*). Public: the welcome and
 * set-up screens link to the legal pages before anyone is signed in. Mirrors the
 * legal page's rule that the test-mode sentence disappears once PAYMENTS_LIVE is on.
 */
export const GET = handler(async () => {
  const legal = Object.fromEntries(
    LEGAL_SLUGS.map((slug) => {
      const d = LEGAL_DOCS[slug];
      const sections = (PAYMENTS_LIVE ? d.sections.map((s) => ({ ...s, body: s.body.filter((p) => p !== TEST_MODE) })) : d.sections).filter(
        (s) => s.body.length > 0,
      );
      return [slug, { slug, title: d.title, summary: d.summary, updated: d.updated, notice: PILOT_NOTICE, sections }];
    }),
  );
  return {
    legal,
    guides: {
      client: { title: "How escrow protects you", steps: CLIENT_STEPS, disputes: CLIENT_DISPUTE_STEPS, faq: CLIENT_FAQ },
      pro: { title: "How Servhive works for pros", benefits: PRO_BENEFITS, pricing: PRO_PRICING },
    },
  };
});
