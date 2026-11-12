import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium leading-none [&_svg]:size-3.5",
  {
    variants: {
      tone: {
        neutral: "bg-surface-2 text-fg",
        accent: "bg-accent-soft text-fg",
        success: "bg-success-soft text-success",
        danger: "bg-danger-soft text-danger",
        info: "bg-info-soft text-info",
        outline: "border border-border text-muted",
        onImage: "bg-black/45 text-white backdrop-blur-md",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

type Tone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

/** Human label + colour for every status enum in the schema. */
const STATUS: Record<string, [string, Tone]> = {
  // ProviderStatus
  DRAFT: ["Draft", "outline"],
  UNDER_REVIEW: ["Under review", "info"],
  APPROVED: ["Verified", "success"],
  REJECTED: ["Rejected", "danger"],
  SUSPENDED: ["Suspended", "danger"],
  // DocStatus
  NOT_UPLOADED: ["Not uploaded", "outline"],
  SUBMITTED: ["Submitted", "info"],
  // QuoteStatus
  PENDING: ["Awaiting quote", "accent"],
  QUOTED: ["Quote sent", "info"],
  ACCEPTED: ["Accepted", "success"],
  DECLINED: ["Declined", "outline"],
  CANCELLED: ["Cancelled", "outline"],
  // JobStatus
  FUNDED: ["In escrow", "accent"],
  AWAITING_RELEASE: ["Awaiting release", "info"],
  RELEASED: ["Paid out", "success"],
  DISPUTED: ["Disputed", "danger"],
  REFUNDED: ["Refunded", "neutral"],
  // ReportStatus
  OPEN: ["Open", "danger"],
  ARTISAN_RESPONDED: ["Artisan responded", "info"],
  RESOLVED: ["Resolved", "success"],
  DISMISSED: ["Dismissed", "outline"],
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const [label, tone] = STATUS[status] ?? [status, "neutral" as Tone];
  return (
    <Badge tone={tone} className={className}>
      {label}
    </Badge>
  );
}
