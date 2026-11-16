export const MAIN_NAV = [
  { href: "/artisans", label: "Find artisans" },
  { href: "/categories", label: "Categories" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-pros", label: "For pros" },
] as const;

export const FOOTER_NAV = [
  {
    title: "Hire",
    links: [
      { href: "/artisans", label: "Browse artisans" },
      { href: "/categories", label: "All categories" },
      { href: "/how-it-works", label: "How escrow works" },
      { href: "/safety", label: "Safety & trust" },
    ],
  },
  {
    title: "Work",
    links: [
      { href: "/for-pros", label: "Join as a pro" },
      { href: "/sign-up", label: "Create an account" },
      { href: "/pro", label: "Pro dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms of Use" },
      { href: "/legal/provider", label: "Provider Agreement" },
      { href: "/legal/protection", label: "Payment Protection Terms" },
      { href: "/legal/privacy", label: "Privacy Policy" },
    ],
  },
] as const;
