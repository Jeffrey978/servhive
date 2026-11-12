"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  Banknote,
  BarChart3,
  Bookmark,
  Briefcase,
  CreditCard,
  FileText,
  Flag,
  Inbox,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Icon names usable in DashboardShell nav items (server → client safe). */
export const DASH_ICONS = {
  overview: LayoutDashboard,
  inbox: Inbox,
  jobs: Briefcase,
  escrow: Wallet,
  saved: Bookmark,
  messages: MessageCircle,
  reports: Flag,
  profile: User,
  verification: BadgeCheck,
  payout: Banknote,
  billing: CreditCard,
  approvals: ShieldCheck,
  directory: Users,
  ledger: BarChart3,
  docs: FileText,
} as const;

export type DashIcon = keyof typeof DASH_ICONS;
export type DashNavItem = { href: string; label: string; icon: DashIcon; badge?: number; exact?: boolean };

export function DashboardNav({ items, variant }: { items: DashNavItem[]; variant: "sidebar" | "tabs" }) {
  const pathname = usePathname();
  const active = (i: DashNavItem) => (i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(i.href + "/"));

  if (variant === "tabs") {
    return (
      <nav className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4" aria-label="Dashboard">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors",
              active(i) ? "bg-fg text-bg" : "text-muted hover:text-fg",
            )}
          >
            {i.label}
            {i.badge ? <span className="rounded-full bg-accent px-1.5 text-[0.6875rem] font-semibold text-accent-fg">{i.badge}</span> : null}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="space-y-0.5" aria-label="Dashboard">
      {items.map((i) => {
        const Icon = DASH_ICONS[i.icon];
        const on = active(i);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[0.9375rem] transition-colors duration-200",
              on ? "bg-surface-2 font-medium text-fg" : "text-muted hover:bg-surface-2/60 hover:text-fg",
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-transform duration-300 ease-out-expo",
                on ? "scale-y-100" : "scale-y-0",
              )}
            />
            <Icon className="size-[18px]" strokeWidth={1.7} />
            <span className="flex-1">{i.label}</span>
            {i.badge ? (
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-[0.6875rem] font-semibold leading-none text-accent-fg">
                {i.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
