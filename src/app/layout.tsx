import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { themeScript } from "@/components/layout/theme-toggle";
import { clerkAppearance } from "@/lib/clerk-appearance";
import "./layers.css";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument-sans", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Servhive — Verified artisans in Port Harcourt", template: "%s · Servhive" },
  description:
    "Hire ID-verified electricians, plumbers, solar installers, stylists and more across Port Harcourt. Your payment is held in escrow until the job is done.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* suppressHydrationWarning: extensions like Grammarly inject attributes on <body> */}
      <body suppressHydrationWarning className="flex min-h-dvh flex-col">
        <ClerkProvider appearance={clerkAppearance}>
          <SmoothScroll />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
