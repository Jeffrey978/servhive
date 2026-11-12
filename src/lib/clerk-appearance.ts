/** Clerk components themed from our CSS variables so they follow light/dark automatically. */
export const clerkAppearance = {
  // Clerk's CSS goes in a layer declared below Tailwind's `utilities` (see globals.css),
  // so the `elements` classes below actually win over Clerk's defaults.
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "var(--fg)",
    colorPrimaryForeground: "var(--bg)",
    colorBackground: "var(--surface)",
    colorForeground: "var(--fg)",
    colorMutedForeground: "var(--muted)",
    colorMuted: "var(--surface-2)",
    colorInput: "var(--surface)",
    colorInputForeground: "var(--fg)",
    colorBorder: "var(--border-strong)",
    colorRing: "var(--accent)",
    colorDanger: "var(--danger)",
    colorSuccess: "var(--success)",
    colorNeutral: "var(--fg)",
    fontFamily: "var(--font-instrument-sans)",
    borderRadius: "0.875rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full max-w-none shadow-none border border-border rounded-[1.25rem]",
    card: "shadow-none",
    headerTitle: "text-2xl font-medium tracking-tight",
    formButtonPrimary: "rounded-full h-11 text-[0.9375rem] font-medium normal-case shadow-none",
    socialButtonsBlockButton: "rounded-full h-11",
    footer: "bg-transparent",
  },
} as const;
