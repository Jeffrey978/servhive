"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/field";
import { FormMessage } from "@/components/client/modal";
import { REPORT_REASONS } from "@/lib/constants";
import { cn, formatNaira } from "@/lib/utils";
import {
  acceptQuoteAction,
  cancelQuoteAction,
  disputeJobAction,
  releaseJobAction,
  submitReviewAction,
} from "@/server/client-actions";

type Panel = "none" | "dispute";

/** Release (two-step) + dispute for a job that is FUNDED or AWAITING_RELEASE. */
export function EscrowJobActions({
  jobId,
  amount,
  providerName,
}: {
  jobId: string;
  amount: number;
  providerName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [panel, setPanel] = useState<Panel>("none");
  const [releaseState, releaseAction, releasing] = useActionState(
    releaseJobAction,
    null,
  );
  const [disputeState, disputeAction, disputing] = useActionState(
    disputeJobAction,
    null,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {confirming ? (
          <form
            action={releaseAction}
            className="flex flex-wrap items-center gap-2"
          >
            <input type="hidden" name="jobId" value={jobId} />
            <Button
              type="submit"
              variant="accent"
              size="sm"
              disabled={releasing}
            >
              {releasing
                ? "Releasing…"
                : `Yes, pay ${formatNaira(amount)} to ${providerName}`}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(false)}
              disabled={releasing}
            >
              Not yet
            </Button>
          </form>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setConfirming(true);
              setPanel("none");
            }}
          >
            Release payment
          </Button>
        )}
        {!confirming ? (
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={panel === "dispute"}
            onClick={() => setPanel(panel === "dispute" ? "none" : "dispute")}
          >
            {panel === "dispute" ? "Close" : "Open dispute"}
          </Button>
        ) : null}
      </div>
      {confirming ? (
        <p className="text-xs text-muted">
          This can&apos;t be undone. Test mode: no real money moves.
        </p>
      ) : null}
      <FormMessage state={releaseState} />

      {panel === "dispute" ? (
        <form
          action={disputeAction}
          className="space-y-4 rounded-2xl border border-border p-4"
        >
          <input type="hidden" name="jobId" value={jobId} />
          <p className="text-sm text-muted">
            Opening a dispute freezes the payment. Our team reviews both sides
            and decides within 5 days.
          </p>
          <Field label="Reason" htmlFor={`d-reason-${jobId}`}>
            <Select
              id={`d-reason-${jobId}`}
              name="reason"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Choose a reason
              </option>
              {REPORT_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <Field label="What went wrong?" htmlFor={`d-notes-${jobId}`}>
            <Textarea
              id={`d-notes-${jobId}`}
              name="notes"
              required
              minLength={10}
              maxLength={2000}
              rows={3}
            />
          </Field>
          <FormMessage state={disputeState} />
          <Button type="submit" variant="danger" size="sm" disabled={disputing}>
            {disputing ? "Opening…" : "Open dispute"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}

/** 1–5 star picker + text for a RELEASED job with no review. */
export function ReviewForm({
  jobId,
  providerName,
}: {
  jobId: string;
  providerName: string;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [state, action, pending] = useActionState(submitReviewAction, null);
  const shown = hover || rating;

  if (state?.ok) return <FormMessage state={state} />;
  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Leave a review
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-border p-4"
    >
      <input type="hidden" name="jobId" value={jobId} />
      <fieldset>
        <legend className="mb-2 text-sm font-medium">
          How did {providerName} do?
        </legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer"
              onMouseEnter={() => setHover(n)}
            >
              <input
                type="radio"
                name="rating"
                value={n}
                required
                checked={rating === n}
                onChange={() => setRating(n)}
                className="peer sr-only"
              />
              <span className="sr-only">
                {n} star{n > 1 ? "s" : ""}
              </span>
              <Star
                aria-hidden
                className={cn(
                  "size-8 rounded-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-accent",
                  n <= shown ? "fill-accent text-accent" : "text-border-strong",
                )}
              />
            </label>
          ))}
        </div>
      </fieldset>
      <Field
        label="Your review"
        htmlFor={`rv-${jobId}`}
        hint="Shown on their profile with your first name and area."
      >
        <Textarea
          id={`rv-${jobId}`}
          name="text"
          required
          minLength={5}
          maxLength={1000}
          rows={3}
        />
      </Field>
      <FormMessage state={state} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending || rating === 0}>
          {pending ? "Posting…" : "Post review"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

/** Accept (two-step, funds escrow) / decline a QUOTED request, or cancel a PENDING one. */
export function QuoteActions({
  quoteId,
  status,
  amount,
}: {
  quoteId: string;
  status: "PENDING" | "QUOTED";
  amount: number | null;
}) {
  const [confirming, setConfirming] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [acceptState, acceptAction, accepting] = useActionState(
    acceptQuoteAction,
    null,
  );
  const [cancelState, cancelAction, cancelling] = useActionState(
    cancelQuoteAction,
    null,
  );
  const busy = accepting || cancelling;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {status === "QUOTED" && amount ? (
          confirming ? (
            <form action={acceptAction} className="flex flex-wrap gap-2">
              <input type="hidden" name="quoteId" value={quoteId} />
              <Button type="submit" variant="accent" size="sm" disabled={busy}>
                {accepting
                  ? "Funding escrow…"
                  : `Confirm: pay ${formatNaira(amount)} into escrow`}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirming(false)}
                disabled={busy}
              >
                Back
              </Button>
            </form>
          ) : (
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                setConfirming(true);
                setCancelConfirm(false);
              }}
            >
              Accept &amp; fund escrow
            </Button>
          )
        ) : null}

        {!confirming ? (
          cancelConfirm ? (
            <form action={cancelAction} className="flex flex-wrap gap-2">
              <input type="hidden" name="quoteId" value={quoteId} />
              <Button type="submit" variant="danger" size="sm" disabled={busy}>
                {cancelling
                  ? "Closing…"
                  : status === "QUOTED"
                    ? "Yes, decline quote"
                    : "Yes, cancel request"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancelConfirm(false)}
                disabled={busy}
              >
                Keep it
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCancelConfirm(true)}
            >
              {status === "QUOTED" ? "Decline" : "Cancel request"}
            </Button>
          )
        ) : null}
      </div>
      {confirming ? (
        <p className="text-xs text-muted">
          Held in escrow until you confirm the work. Test mode: no real charge.
        </p>
      ) : null}
      <FormMessage state={acceptState} />
      <FormMessage state={cancelState} />
    </div>
  );
}
