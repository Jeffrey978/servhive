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
      { href: "/legal/terms", label: "Terms of service" },
      { href: "/legal/provider", label: "Provider agreement" },
      { href: "/legal/protection", label: "Hirer protection" },
      { href: "/legal/privacy", label: "Privacy policy" },
    ],
  },
] as const;
