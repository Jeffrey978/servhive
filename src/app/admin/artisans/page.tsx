import Link from "next/link";
import Form from "next/form";
import { requireRole } from "@/lib/auth";
import { listArtisans, pageOf, pick, PAGE_SIZE, PROVIDER_STATUSES, str } from "@/server/admin";
import { reinstateProvider, suspendProvider } from "@/server/admin-actions";
import { Avatar, EmptyState, PageHeader, Stars } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { Pager, Table, Td, Tr, withParams } from "@/components/admin/table";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Artisans" };

const STATUS_LABEL = { DRAFT: "Draft", UNDER_REVIEW: "Under review", APPROVED: "Verified", REJECTED: "Rejected", SUSPENDED: "Suspended" };

export default async function ArtisansPage({ searchParams }: PageProps<"/admin/artisans">) {
  await requireRole("ADMIN", "/admin/artisans");
  const sp = await searchParams;
  const q = str(sp.q);
  const status = pick(sp.status, PROVIDER_STATUSES);
  const page = pageOf(sp.page);
  const { rows, total, categories } = await listArtisans({ q, status, category: str(sp.category) || undefined, page });
  const category = categories.some((c) => c.id === sp.category) ? (sp.category as string) : "";
  const filtered = !!(q || status || category);

  return (
    <>
      <PageHeader
        eyebrow="Directory"
        title="Artisans"
        description={`${total.toLocaleString()} ${total === 1 ? "artisan" : "artisans"}${filtered ? " match these filters" : " on Servhive"}.`}
      />

      <Form action="/admin/artisans" className="mb-6 grid gap-2 sm:grid-cols-[minmax(0,1fr)_11rem_13rem_auto]">
        <Input name="q" defaultValue={q} placeholder="Search business or owner name" aria-label="Search" className="h-11" />
        <Select name="status" defaultValue={status ?? ""} aria-label="Status" className="h-11">
          <option value="">All statuses</option>
          {PROVIDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
        <Select name="category" defaultValue={category} aria-label="Trade" className="h-11">
          <option value="">All trades</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Button type="submit" variant="primary" className="h-11 flex-1 sm:flex-none">
            Filter
          </Button>
          {filtered ? (
            <Link href="/admin/artisans" className={buttonVariants({ variant: "ghost", className: "h-11" })}>
              Clear
            </Link>
          ) : null}
        </div>
      </Form>

      {rows.length === 0 ? (
        <EmptyState
          title={filtered ? "No artisans match" : "No artisans yet"}
          body={filtered ? "Try a different name, status or trade." : "Artisans appear here as soon as they start onboarding."}
        />
      ) : (
        <Table head={["Artisan", "Trade", "Area", "Status", "Rating", "Jobs", "Joined", ""]}>
          {rows.map((p) => (
            <Tr key={p.id}>
              <Td className="pb-2 md:pb-3.5">
                <Link href={`/admin/approvals/${p.id}`} className="flex items-center gap-3">
                  <Avatar name={p.businessName} src={p.imageUrl} size={36} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium hover:underline">{p.businessName}</span>
                    <span className="block truncate text-xs text-muted">{p.ownerName}</span>
                  </span>
                </Link>
              </Td>
              <Td label="Trade">{p.category.name}</Td>
              <Td label="Area">
                <span className="whitespace-nowrap">{p.area}</span>
              </Td>
              <Td label="Status">
                <StatusBadge status={p.status} />
              </Td>
              <Td label="Rating">
                {p.reviewCount > 0 ? (
                  <span className="whitespace-nowrap">
                    <Stars value={p.ratingAvg} /> <span className="text-xs text-muted">({p.reviewCount})</span>
                  </span>
                ) : (
                  <span className="text-xs text-muted">No reviews</span>
                )}
              </Td>
              <Td label="Jobs">
                <span className="tabular-nums">{p._count.jobs}</span>
              </Td>
              <Td label="Joined">
                <span className="whitespace-nowrap text-muted">{formatDate(p.createdAt)}</span>
              </Td>
              <Td align="right" className="pt-3 md:pt-3.5">
                <div className="flex flex-wrap items-start gap-2 md:justify-end">
                  <Link href={`/admin/approvals/${p.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Evidence
                  </Link>
                  {p.status === "APPROVED" ? (
                    <Link href={`/artisans/${p.slug}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                      Profile
                    </Link>
                  ) : null}
                  {p.status === "APPROVED" || p.status === "UNDER_REVIEW" ? (
                    <ConfirmAction
                      action={suspendProvider}
                      fields={{ providerId: p.id }}
                      label="Suspend"
                      confirmLabel="Suspend artisan"
                      confirmVariant="danger"
                      variant="ghost"
                      prompt="Hidden from the marketplace straight away."
                      className="text-left"
                    />
                  ) : p.status === "SUSPENDED" ? (
                    <ConfirmAction
                      action={reinstateProvider}
                      fields={{ providerId: p.id }}
                      label="Reinstate"
                      confirmLabel="Yes, reinstate"
                      className="text-left"
                    />
                  ) : null}
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      )}

      <Pager
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        hrefFor={(n) => withParams("/admin/artisans", { q, status, category, page: n })}
      />
    </>
  );
}
