import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { DashNavItem } from "@/components/dashboard/dashboard-nav";
import { StatusBadge } from "@/components/ui/badge";
import { billingState, loadPro, pendingRequestCount } from "@/server/pro";
import { formatDate } from "@/lib/utils";

export default async function ProLayout({ children }: LayoutProps<"/pro">) {
  const { user, provider } = await loadPro("/pro");
  const pending = provider ? await pendingRequestCount(provider.id) : 0;

  const nav: DashNavItem[] = [
    { href: "/pro", label: "Overview", icon: "overview", exact: true },
    { href: "/pro/requests", label: "Requests", icon: "inbox", badge: pending || undefined },
    { href: "/pro/jobs", label: "Jobs", icon: "jobs" },
    { href: "/pro/profile", label: "Profile", icon: "profile" },
    { href: "/pro/verification", label: "Verification", icon: "verification" },
    { href: "/pro/payout", label: "Payout", icon: "payout" },
    { href: "/pro/billing", label: "Billing", icon: "billing" },
    { href: "/pro/complaints", label: "Complaints", icon: "reports" },
    { href: "/pro/messages", label: "Messages", icon: "messages" },
  ];

  let aside = null;
  if (provider) {
    const b = billingState(provider);
    aside = (
      <div className="rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow">Status</p>
          <StatusBadge status={provider.status} />
        </div>
        <p className="mt-3 text-sm text-muted">
          {b.state === "trial"
            ? `Free trial · ${b.trialDaysLeft} day${b.trialDaysLeft === 1 ? "" : "s"} left`
            : b.state === "paid" && b.paidUntil
              ? `Paid until ${formatDate(b.paidUntil)}`
              : "Subscription due"}
        </p>
      </div>
    );
  }

  return (
    <DashboardShell
      label="Pro portal"
      nav={nav}
      user={{ name: provider?.businessName ?? user.name, subtitle: provider?.category.name ?? "Artisan" }}
      aside={aside}
    >
      {children}
    </DashboardShell>
  );
}
