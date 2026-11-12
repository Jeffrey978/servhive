import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { DashNavItem } from "@/components/dashboard/dashboard-nav";

export const metadata: Metadata = {
  title: { default: "My account", template: "%s · My account · Servhive" },
};

export default async function AccountLayout({
  children,
}: LayoutProps<"/account">) {
  const user = await requireRole("CLIENT", "/account");

  const [quotesReady, awaitingRelease] = await Promise.all([
    db.quoteRequest.count({ where: { clientId: user.id, status: "QUOTED" } }),
    db.escrowJob.count({
      where: { clientId: user.id, status: "AWAITING_RELEASE" },
    }),
  ]);

  const nav: DashNavItem[] = [
    { href: "/account", label: "Overview", icon: "overview", exact: true },
    {
      href: "/account/jobs",
      label: "Jobs & escrow",
      icon: "escrow",
      badge: awaitingRelease || undefined,
    },
    {
      href: "/account/quotes",
      label: "Quotes",
      icon: "inbox",
      badge: quotesReady || undefined,
    },
    { href: "/account/saved", label: "Saved", icon: "saved" },
    { href: "/account/messages", label: "Messages", icon: "messages" },
    { href: "/account/reports", label: "Reports", icon: "reports" },
  ];

  return (
    <DashboardShell
      label="My account"
      nav={nav}
      user={{ name: user.name, subtitle: user.area ?? "Client" }}
    >
      {children}
    </DashboardShell>
  );
}
