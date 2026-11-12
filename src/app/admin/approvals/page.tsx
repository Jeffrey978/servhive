import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { RULES } from "@/lib/constants";
import { listApprovals, pick, type ApprovalTab } from "@/server/admin";
import { Avatar, EmptyState, PageHeader } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { FilterTabs, Table, Td, Tr } from "@/components/admin/table";
import { cn, timeAgo } from "@/lib/utils";

export const metadata = { title: "Approvals" };

const TABS: { value: ApprovalTab; label: string }[] = [
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "REJECTED", label: "Rejected" },
  { value: "DRAFT", label: "Draft" },
];

export default async function ApprovalsPage({ searchParams }: PageProps<"/admin/approvals">) {
  await requireRole("ADMIN", "/admin/approvals");
  const sp = await searchParams;
  const tab = pick(sp.status, ["UNDER_REVIEW", "REJECTED", "DRAFT"] as const) ?? "UNDER_REVIEW";
  const { rows, counts } = await listApprovals(tab);

  return (
    <>
      <PageHeader
        eyebrow="Verification"
        title="Approvals"
        description={`Check the ID, any trade licence and at least ${RULES.minWorkPhotosForReview} work photos before an artisan goes live.`}
      />

      <FilterTabs
        active={tab}
        items={TABS.map((t) => ({
          ...t,
          href: t.value === "UNDER_REVIEW" ? "/admin/approvals" : `/admin/approvals?status=${t.value}`,
          count: counts[t.value],
          highlight: t.value === "UNDER_REVIEW",
        }))}
      />

      {rows.length === 0 ? (
        <EmptyState
          title={tab === "UNDER_REVIEW" ? "Queue is clear" : "Nothing here"}
          body={
            tab === "UNDER_REVIEW"
              ? "Every submitted artisan has been reviewed. New submissions land here first."
              : tab === "DRAFT"
                ? "No artisans are midway through onboarding."
                : "No rejected submissions."
          }
        />
      ) : (
        <Table head={["Artisan", "Trade", "ID", "Licence", "Photos", tab === "DRAFT" ? "Started" : "Submitted", ""]}>
          {rows.map((p) => {
            const id = p.documents.find((d) => d.kind === "GOVERNMENT_ID");
            const lic = p.documents.find((d) => d.kind === "TRADE_LICENCE");
            const photos = p._count.workPhotos;
            return (
              <Tr key={p.id}>
                <Td className="pb-2 md:pb-3.5">
                  <Link href={`/admin/approvals/${p.id}`} className="flex items-center gap-3">
                    <Avatar name={p.businessName} src={p.imageUrl} size={36} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium hover:underline">{p.businessName}</span>
                      <span className="block truncate text-xs text-muted">{p.ownerName}</span>
                    </span>
                  </Link>
                  {tab === "REJECTED" && p.rejectionReason ? (
                    <p className="mt-2 max-w-xs text-xs text-muted md:line-clamp-2">“{p.rejectionReason}”</p>
                  ) : null}
                </Td>
                <Td label="Trade">
                  <span>
                    {p.category.name}
                    <span className="block text-xs text-muted">{p.area}</span>
                  </span>
                </Td>
                <Td label="ID">{id ? <StatusBadge status={id.status} /> : <StatusBadge status="NOT_UPLOADED" />}</Td>
                <Td label="Licence">
                  {p.category.requiresLicence ? (
                    lic ? (
                      <StatusBadge status={lic.status} />
                    ) : (
                      <span className="text-xs font-medium text-danger">Required, missing</span>
                    )
                  ) : (
                    <span className="text-xs text-muted">Not required</span>
                  )}
                </Td>
                <Td label="Photos">
                  <span
                    className={cn(
                      "font-mono text-xs tabular-nums",
                      photos < RULES.minWorkPhotosForReview ? "text-danger" : "text-fg",
                    )}
                  >
                    {photos} / {RULES.minWorkPhotosForReview}
                  </span>
                </Td>
                <Td label={tab === "DRAFT" ? "Started" : "Submitted"}>
                  <span className="text-xs text-muted">{timeAgo(p.updatedAt)}</span>
                </Td>
                <Td align="right" className="pt-3 md:pt-3.5">
                  <Link href={`/admin/approvals/${p.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Review
                  </Link>
                </Td>
              </Tr>
            );
          })}
        </Table>
      )}
    </>
  );
}
