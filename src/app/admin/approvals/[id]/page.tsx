import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";
import { RULES } from "@/lib/constants";
import { approvalBlockers, getEvidence, maskAccount } from "@/server/admin";
import {
  approveProvider,
  reinstateProvider,
  rejectProvider,
  reviewDocument,
  suspendProvider,
  verifyPayoutName,
} from "@/server/admin-actions";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card, PageHeader, Stars } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button";
import { BackLink } from "@/components/admin/table";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { cn, formatDate, formatNaira } from "@/lib/utils";
import type { VerificationDocument } from "@/generated/prisma/client";

export const metadata = { title: "Evidence review" };

export default async function EvidencePage({ params }: PageProps<"/admin/approvals/[id]">) {
  const { id } = await params;
  await requireRole("ADMIN", `/admin/approvals/${id}`);
  const p = await getEvidence(id);
  if (!p) notFound();

  const idDoc = p.documents.find((d) => d.kind === "GOVERNMENT_ID") ?? null;
  const licDoc = p.documents.find((d) => d.kind === "TRADE_LICENCE") ?? null;
  const photos = p.workPhotos.length;
  const blockers = approvalBlockers({ ...p, workPhotoCount: photos });
  const contactEmail = p.user?.email ?? null;
  const contactPhone = p.user?.phone ?? p.phone ?? null;

  const checks: { label: string; ok: boolean; detail: string }[] = [
    {
      label: "Government ID",
      ok: !!idDoc && idDoc.status !== "REJECTED",
      detail: idDoc ? statusWord(idDoc.status) : "Not uploaded",
    },
    ...(p.category.requiresLicence
      ? [
          {
            label: "Trade licence",
            ok: !!licDoc && licDoc.status !== "REJECTED",
            detail: licDoc ? statusWord(licDoc.status) : "Required, missing",
          },
        ]
      : []),
    {
      label: "Work photos",
      ok: photos >= RULES.minWorkPhotosForReview,
      detail: `${photos} of ${RULES.minWorkPhotosForReview} minimum`,
    },
    { label: "Payout account", ok: !!p.payoutAccount, detail: p.payoutAccount ? "Added" : "Not added" },
  ];

  return (
    <>
      <BackLink href="/admin/approvals">Approvals</BackLink>
      <PageHeader
        eyebrow={`Evidence · ${p.category.name}`}
        title={p.businessName}
        description={`${p.ownerName} · ${p.area}${p.subSpecialty ? ` · ${p.subSpecialty}` : ""}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={p.status} />
            {p.status === "APPROVED" ? (
              <Link href={`/artisans/${p.slug}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Public profile
              </Link>
            ) : null}
          </div>
        }
      />

      {p.rejectionReason && (p.status === "REJECTED" || p.status === "SUSPENDED") ? (
        <div className="mb-8 rounded-card border border-danger/40 bg-danger-soft px-5 py-4 text-sm">
          <p className="eyebrow mb-1">{p.status === "REJECTED" ? "Rejection reason" : "Suspension note"}</p>
          <p>{p.rejectionReason}</p>
        </div>
      ) : null}

      {/* Checklist */}
      <ol className="mb-10 grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
        {checks.map((c, i) => (
          <li key={c.label} className="flex items-baseline gap-3 border-b border-border py-4 sm:pr-4">
            <span className="font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{c.label}</span>
              <span className={cn("block text-xs", c.ok ? "text-success" : "text-danger")}>{c.detail}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Evidence */}
        <div className="min-w-0 space-y-12">
          <DocSection n="01" title="Government ID" doc={idDoc} emptyText="No ID uploaded yet." />

          <DocSection
            n="02"
            title="Trade licence"
            doc={licDoc}
            flag={p.category.requiresLicence ? "Licence required for this trade" : undefined}
            emptyText={p.category.requiresLicence ? "Required for this trade and not uploaded." : "Not required for this trade."}
          />

          <section>
            <SectionTitle n="03" title="Work photos" meta={`${photos} uploaded`} />
            {photos === 0 ? (
              <p className="text-sm text-muted">No work photos yet.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {p.workPhotos.map((ph) => (
                  <li key={ph.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                    <div className="aspect-[4/3] bg-surface-2">
                      {/* eslint-disable-next-line @next/next/no-img-element -- user uploads may be data URLs */}
                      <img src={ph.url} alt={ph.caption} loading="lazy" className="size-full object-cover" />
                    </div>
                    <p className="truncate px-3 py-2 text-xs">
                      {ph.caption}
                      {ph.area ? <span className="text-muted"> · {ph.area}</span> : null}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionTitle n="04" title="Services" meta={`Starting price ${formatNaira(p.startingPrice)}`} />
            {p.services.length === 0 ? (
              <p className="text-sm text-muted">No services listed.</p>
            ) : (
              <ul className="border-t border-border">
                {p.services.map((s) => (
                  <li key={s.id} className="flex items-baseline justify-between gap-4 border-b border-border py-3 text-sm">
                    <span className="min-w-0">{s.name}</span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {s.priceType === "STARTING_FROM" ? <span className="mr-1 text-xs font-normal text-muted">from</span> : null}
                      {formatNaira(s.price)}
                      {s.priceType === "PER_UNIT" ? (
                        <span className="ml-1 text-xs font-normal text-muted">
                          per {s.unitLabel ?? "unit"}
                        </span>
                      ) : s.priceType === "MILESTONE" ? (
                        <span className="ml-1 text-xs font-normal text-muted">per milestone</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {p.bio ? <p className="mt-4 max-w-prose text-sm whitespace-pre-line text-muted">{p.bio}</p> : null}
          </section>

          <section>
            <SectionTitle n="05" title="Payout name check" meta={p.payoutAccount ? undefined : "No account yet"} />
            {!p.payoutAccount ? (
              <p className="text-sm text-muted">The artisan hasn&apos;t added a payout account yet.</p>
            ) : (
              <PayoutNameCheck
                providerId={p.id}
                ownerName={p.ownerName}
                account={p.payoutAccount}
              />
            )}
          </section>
        </div>

        {/* Facts + decision */}
        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <Card className="p-5">
            <p className="eyebrow mb-4">Decision</p>
            <DecisionPanel providerId={p.id} status={p.status} blockers={blockers} />
          </Card>

          <Card className="divide-y divide-border">
            <Fact label="Owner">{p.ownerName}</Fact>
            <Fact label="Email">
              {contactEmail ? (
                <a href={`mailto:${contactEmail}`} className="break-all hover:underline">
                  {contactEmail}
                </a>
              ) : (
                "—"
              )}
            </Fact>
            <Fact label="Phone">
              {contactPhone ? (
                <a href={`tel:${contactPhone}`} className="hover:underline">
                  {contactPhone}
                </a>
              ) : (
                "—"
              )}
            </Fact>
            <Fact label="Trade">
              <span className="flex flex-wrap items-center justify-end gap-1.5">
                {p.category.name}
                {p.category.requiresLicence ? <Badge tone="danger">Licence required</Badge> : null}
              </span>
            </Fact>
            <Fact label="Areas">{[p.area, ...p.areasCovered.filter((a) => a !== p.area)].join(", ")}</Fact>
            <Fact label="Experience">{p.yearsExperience != null ? `${p.yearsExperience} yrs` : "—"}</Fact>
            <Fact label="Starting price">{formatNaira(p.startingPrice)}</Fact>
            <Fact label="Payout">
              {p.payoutAccount ? (
                <span className="text-right">
                  <span className="block font-mono">{maskAccount(p.payoutAccount.accountNumber)}</span>
                  <span className="block text-xs text-muted">{p.payoutAccount.bankName}</span>
                </span>
              ) : (
                <span className="text-muted">Not added</span>
              )}
            </Fact>
            {p.status === "APPROVED" || p.reviewCount > 0 ? (
              <Fact label="Rating">
                <Stars value={p.ratingAvg} /> <span className="text-xs text-muted">({p.reviewCount})</span>
              </Fact>
            ) : null}
            <Fact label="Jobs / reports">
              {p._count.jobs} / {p._count.reports}
            </Fact>
            <Fact label="Joined">{formatDate(p.createdAt)}</Fact>
          </Card>
        </aside>
      </div>
    </>
  );
}

function statusWord(s: VerificationDocument["status"]) {
  return { NOT_UPLOADED: "Not uploaded", SUBMITTED: "Submitted, needs review", APPROVED: "Approved", REJECTED: "Rejected" }[s];
}

function SectionTitle({ n, title, meta, flag }: { n: string; title: string; meta?: string; flag?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-3">
      <span className="font-mono text-xs text-muted">{n}</span>
      <h2 className="text-h3 font-medium">{title}</h2>
      {flag ? <Badge tone="danger">{flag}</Badge> : null}
      {meta ? <span className="ml-auto text-sm text-muted">{meta}</span> : null}
    </div>
  );
}

function DocSection({
  n,
  title,
  doc,
  flag,
  emptyText,
}: {
  n: string;
  title: string;
  doc: VerificationDocument | null;
  flag?: string;
  emptyText: string;
}) {
  return (
    <section>
      <SectionTitle n={n} title={title} flag={flag} />
      {!doc ? (
        <p className={cn("text-sm", flag ? "text-danger" : "text-muted")}>{emptyText}</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-2 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- private doc streamed via an admin-only route */}
            <img src={`/admin/doc/${doc.id}`} alt={`${title} uploaded by the artisan`} className="max-h-[28rem] w-auto max-w-full object-contain" />
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <StatusBadge status={doc.status} />
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="eyebrow">File</dt>
                <dd className="break-all">{doc.fileName}</dd>
              </div>
              {doc.licenceNumber ? (
                <div>
                  <dt className="eyebrow">Licence number</dt>
                  <dd className="font-mono">{doc.licenceNumber}</dd>
                </div>
              ) : null}
              <div>
                <dt className="eyebrow">Submitted</dt>
                <dd>{formatDate(doc.submittedAt)}</dd>
              </div>
              {doc.reviewedAt ? (
                <div>
                  <dt className="eyebrow">Reviewed</dt>
                  <dd>{formatDate(doc.reviewedAt)}</dd>
                </div>
              ) : null}
              {doc.status === "REJECTED" && doc.rejectionReason ? (
                <div>
                  <dt className="eyebrow">Reason</dt>
                  <dd className="text-danger">{doc.rejectionReason}</dd>
                </div>
              ) : null}
            </dl>
            <div className="flex flex-col items-start gap-2">
              {doc.status !== "APPROVED" ? (
                <ConfirmAction
                  action={reviewDocument}
                  fields={{ docId: doc.id, decision: "APPROVE" }}
                  label="Approve document"
                  confirmLabel="Yes, approve"
                  prompt="The document looks genuine and matches the owner."
                />
              ) : null}
              {doc.status !== "REJECTED" ? (
                <ConfirmAction
                  action={reviewDocument}
                  fields={{ docId: doc.id, decision: "REJECT" }}
                  label="Reject document"
                  confirmLabel="Reject document"
                  confirmVariant="danger"
                  note={{ name: "reason", label: "Reason (shown to the artisan)", placeholder: "Photo is blurred; the name isn't readable.", required: true }}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function DecisionPanel({
  providerId,
  status,
  blockers,
}: {
  providerId: string;
  status: string;
  blockers: string[];
}) {
  const fields = { providerId };

  if (status === "DRAFT") {
    return <p className="text-sm text-muted">Onboarding isn&apos;t finished. Nothing to decide until the artisan submits.</p>;
  }
  if (status === "REJECTED") {
    return <p className="text-sm text-muted">Rejected. It comes back to the queue when the artisan fixes it and resubmits.</p>;
  }
  if (status === "SUSPENDED") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">Hidden from the marketplace. Reinstating puts the profile back live.</p>
        <ConfirmAction action={reinstateProvider} fields={fields} label="Reinstate" confirmLabel="Yes, reinstate" />
      </div>
    );
  }

  const suspend = (
    <ConfirmAction
      action={suspendProvider}
      fields={fields}
      label="Suspend"
      confirmLabel="Suspend artisan"
      confirmVariant="danger"
      variant="ghost"
      prompt="The profile disappears from the marketplace straight away."
      note={{ name: "note", label: "Note (optional, shown to the artisan)" }}
    />
  );

  if (status === "APPROVED") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">Live with a verified badge.</p>
        {suspend}
      </div>
    );
  }

  // UNDER_REVIEW
  const ready = blockers.length === 0;
  return (
    <div className="space-y-4">
      {ready ? (
        <p className="text-sm text-muted">Everything required is in. Approving also signs off any document still marked submitted.</p>
      ) : (
        <ul className="space-y-1.5 text-sm text-danger">
          {blockers.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      <div className="flex flex-col items-start gap-2">
        <ConfirmAction
          action={approveProvider}
          fields={fields}
          label="Approve artisan"
          confirmLabel="Yes, approve and publish"
          prompt="The profile goes live with a verified badge."
          variant="primary"
          disabled={!ready}
        />
        <ConfirmAction
          action={rejectProvider}
          fields={fields}
          label="Reject"
          confirmLabel="Reject submission"
          confirmVariant="danger"
          note={{
            name: "reason",
            label: "Reason (shown to the artisan)",
            placeholder: "Your ID photo is unclear. Upload a sharper photo of the front.",
            required: true,
          }}
        />
        {suspend}
      </div>
    </div>
  );
}

/** Loose name comparison: case/space/punctuation-insensitive, word-order-insensitive. */
function nameSimilarity(a: string, b: string) {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  const wa = norm(a);
  const wb = new Set(norm(b));
  if (wa.length === 0) return 0;
  const shared = wa.filter((w) => wb.has(w)).length;
  return shared / Math.max(wa.length, wb.size || 1);
}

function PayoutNameCheck({
  providerId,
  ownerName,
  account,
}: {
  providerId: string;
  ownerName: string;
  account: { bankName: string; accountNumber: string; accountName: string; verified: boolean };
}) {
  const sim = nameSimilarity(account.accountName, ownerName);
  const hint =
    sim >= 0.99
      ? { tone: "success" as const, text: "Account name matches the owner name exactly." }
      : sim >= 0.5
        ? { tone: "accent" as const, text: "Partial match — check it against the ID document above." }
        : { tone: "danger" as const, text: "Names look different — check carefully against the ID before verifying." };

  return (
    <div className="space-y-5">
      <p className="max-w-prose text-sm text-muted">
        Confirm the bank account name matches the name on the government ID (section 01). There&apos;s no automatic bank
        check, so this is a manual comparison.
      </p>
      <dl className="grid max-w-md gap-px overflow-hidden rounded-xl border border-border bg-border text-sm">
        <div className="flex justify-between gap-4 bg-surface px-4 py-3">
          <dt className="text-muted">Name on account</dt>
          <dd className="text-right font-medium">{account.accountName}</dd>
        </div>
        <div className="flex justify-between gap-4 bg-surface px-4 py-3">
          <dt className="text-muted">Owner / ID name</dt>
          <dd className="text-right">{ownerName}</dd>
        </div>
        <div className="flex justify-between gap-4 bg-surface px-4 py-3">
          <dt className="text-muted">Bank</dt>
          <dd className="text-right">
            {account.bankName} · <span className="font-mono">{account.accountNumber}</span>
          </dd>
        </div>
      </dl>
      <p
        className={cn(
          "text-sm",
          hint.tone === "success" ? "text-success" : hint.tone === "danger" ? "text-danger" : "text-fg",
        )}
      >
        {hint.text}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {account.verified ? (
          <>
            <Badge tone="success">Name verified</Badge>
            <ConfirmAction
              action={verifyPayoutName}
              fields={{ providerId, decision: "UNVERIFY" }}
              label="Remove verification"
              confirmLabel="Remove verification"
              confirmVariant="danger"
              variant="ghost"
            />
          </>
        ) : (
          <ConfirmAction
            action={verifyPayoutName}
            fields={{ providerId, decision: "VERIFY" }}
            label="Mark name as matching"
            confirmLabel="Yes, it matches the ID"
            prompt="The account name matches the name on the government ID."
            variant="primary"
          />
        )}
      </div>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-3 text-sm">
      <span className="eyebrow shrink-0">{label}</span>
      <span className="min-w-0 text-right">{children}</span>
    </div>
  );
}
