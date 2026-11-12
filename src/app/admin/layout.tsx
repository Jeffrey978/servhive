import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FeedbackProvider } from "@/components/admin/feedback";
import { adminNavCounts } from "@/server/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Servhive admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireRole("ADMIN", "/admin");
  const counts = await adminNavCounts();

  return (
    <DashboardShell
      label="Admin"
      user={{ name: user.name, subtitle: user.email ?? "Administrator" }}
      nav={[
        { href: "/admin", label: "Overview", icon: "overview", exact: true },
        { href: "/admin/approvals", label: "Approvals", icon: "approvals", badge: counts.pending },
        { href: "/admin/artisans", label: "Artisans", icon: "directory" },
        { href: "/admin/reports", label: "Reports", icon: "reports", badge: counts.reports },
        { href: "/admin/escrow", label: "Escrow ledger", icon: "ledger" },
      ]}
    >
      <FeedbackProvider>{children}</FeedbackProvider>
    </DashboardShell>
  );
}
