import { formatDate } from "@/lib/utils";
import { loadPro, readiness } from "@/server/pro";
import { submitForReviewAction, uploadDocumentAction } from "@/server/pro-actions";
import { Card, PageHeader } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/badge";
import { Checklist } from "@/components/pro/checklist";
import { DocUpload } from "@/components/pro/doc-upload";
import { ActionButton } from "@/components/pro/form-bits";
import { NoProvider } from "@/components/pro/no-provider";
import { ProSection } from "@/components/pro/section";

export default async function ProVerificationPage() {
  const { provider } = await loadPro("/pro/verification");
  if (!provider) return <NoProvider />;

  const ready = await readiness(provider);
  const idDoc = ready.docs.find((d) => d.kind === "GOVERNMENT_ID");
  const licence = ready.docs.find((d) => d.kind === "TRADE_LICENCE");
  const status = provider.status;

  return (
    <>
      <PageHeader
        eyebrow="Verification"
        title={
          <>
            Get <em className="font-serif font-normal">verified</em>
          </>
        }
        description="Every artisan on Servhive is ID-checked before clients can book them. Documents are only seen by our review team."
        actions={<StatusBadge status={status} />}
      />

      {status === "REJECTED" ? (
        <Card className="mb-8 border-danger/40 p-5">
          <p className="eyebrow">Reason</p>
          <p className="mt-2 text-[0.9375rem]">{provider.rejectionReason ?? "Please update your documents and resubmit."}</p>
        </Card>
      ) : status === "SUSPENDED" ? (
        <Card className="mb-8 border-danger/40 p-5">
          <p className="eyebrow">Note from Servhive</p>
          <p className="mt-2 text-[0.9375rem]">{provider.rejectionReason ?? "Contact support to resolve open issues on your account."}</p>
        </Card>
      ) : null}

      <ProSection n="01" title="Checklist">
        <Checklist items={ready.items} />
        <div className="mt-6">
          {status === "UNDER_REVIEW" ? (
            <p className="text-sm text-muted">Submitted. We usually review within 1–2 working days.</p>
          ) : status === "APPROVED" ? (
            <p className="text-sm text-muted">You&apos;re verified and live in the marketplace.</p>
          ) : status === "SUSPENDED" ? null : (
            <>
              <ActionButton
                action={submitForReviewAction}
                label={status === "REJECTED" ? "Resubmit for review" : "Submit for review"}
                pendingLabel="Submitting…"
                disabled={!ready.canSubmit}
              />
              {!ready.canSubmit ? <p className="mt-2 text-sm text-muted">Complete the required items above first.</p> : null}
            </>
          )}
        </div>
      </ProSection>

      <ProSection n="02" title="Government ID" aside={<StatusBadge status={idDoc?.status ?? "NOT_UPLOADED"} />}>
        <DocMeta doc={idDoc} hint="NIN slip, driver's licence, voter's card or international passport. All four corners visible." />
        <DocUpload kind="GOVERNMENT_ID" action={uploadDocumentAction} hasExisting={!!idDoc} />
      </ProSection>

      {ready.needsLicence ? (
        <ProSection n="03" title="Trade licence" aside={<StatusBadge status={licence?.status ?? "NOT_UPLOADED"} />}>
          <DocMeta doc={licence} hint={`${provider.category.name} is a regulated trade. Upload your current licence or certificate.`} />
          <DocUpload kind="TRADE_LICENCE" action={uploadDocumentAction} hasExisting={!!licence} licenceNumber={licence?.licenceNumber} />
        </ProSection>
      ) : null}
    </>
  );
}

function DocMeta({
  doc,
  hint,
}: {
  doc?: { fileName: string; submittedAt: Date; status: string; rejectionReason: string | null; licenceNumber: string | null };
  hint: string;
}) {
  return (
    <div className="mb-6 space-y-2">
      <p className="text-sm text-muted">{hint}</p>
      {doc ? (
        <p className="text-sm">
          <span className="font-medium">{doc.fileName}</span>
          <span className="text-muted">
            {" "}
            · uploaded {formatDate(doc.submittedAt)}
            {doc.licenceNumber ? ` · No. ${doc.licenceNumber}` : null}
          </span>
        </p>
      ) : null}
      {doc?.status === "REJECTED" ? (
        <p className="text-sm text-danger">Rejected: {doc.rejectionReason ?? "Please upload a clearer copy."}</p>
      ) : null}
    </div>
  );
}
