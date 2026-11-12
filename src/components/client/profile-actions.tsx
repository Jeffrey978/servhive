"use client";

import Link from "next/link";
import { useActionState, useOptimistic, useState, useTransition } from "react";
import { Heart, Lock, MessageCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { FormMessage, Modal } from "@/components/client/modal";
import { AREAS, REPORT_REASONS, RULES } from "@/lib/constants";
import { cn, formatNaira } from "@/lib/utils";
import {
  bookServiceAction,
  messageProviderAction,
  reportProviderAction,
  requestQuoteAction,
  toggleSavedAction,
} from "@/server/client-actions";

type ProviderLite = {
  id: string;
  businessName: string;
  startingPrice: number;
  area: string;
};

/** Sticky hire rail on the profile: price, quote, message, save. */
export function HireRail({
  provider,
  saved,
  today,
}: {
  provider: ProviderLite;
  saved: boolean;
  today: string;
}) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteKey, setQuoteKey] = useState(0);
  const [msgState, msgAction, msgPending] = useActionState(
    messageProviderAction,
    null,
  );

  return (
    <div className="rounded-card border border-border bg-surface p-5 md:p-6">
      <p className="eyebrow">Starting from</p>
      <p className="mt-2 text-h2 font-medium">
        {formatNaira(provider.startingPrice)}
      </p>
      <p className="mt-2 text-sm text-muted">
        Final price agreed in the quote. Paid into escrow, released when you
        confirm.
      </p>

      <div className="mt-6 grid gap-2">
        <Button
          variant="accent"
          size="lg"
          onClick={() => {
            setQuoteKey((k) => k + 1); // fresh form each time
            setQuoteOpen(true);
          }}
        >
          Request a quote
        </Button>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <form action={msgAction}>
            <input type="hidden" name="providerId" value={provider.id} />
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="w-full"
              disabled={msgPending}
            >
              <MessageCircle /> {msgPending ? "Opening…" : "Message"}
            </Button>
          </form>
          <SaveToggle providerId={provider.id} saved={saved} />
        </div>
      </div>
      {msgState && !msgState.ok ? (
        <div className="mt-3">
          <FormMessage state={msgState} />
        </div>
      ) : null}

      <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted">
        <Lock className="size-3.5 shrink-0" /> Keep payments on Servhive. Escrow
        only covers jobs booked here.
      </p>

      <Modal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        title="Request a quote"
        description={`${provider.businessName} will reply with a price and timeline. Nothing is charged yet.`}
      >
        <QuoteForm
          key={quoteKey}
          provider={provider}
          today={today}
          onDone={() => setQuoteOpen(false)}
        />
      </Modal>
    </div>
  );
}

function QuoteForm({
  provider,
  today,
  onDone,
}: {
  provider: ProviderLite;
  today: string;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(requestQuoteAction, null);

  if (state?.ok) {
    return (
      <div className="space-y-5">
        <FormMessage state={state} />
        <div className="flex flex-wrap gap-2">
          <Link
            href="/account/quotes"
            className={buttonVariants({ variant: "primary" })}
          >
            View my quotes
          </Link>
          <Button variant="ghost" onClick={onDone}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="providerId" value={provider.id} />
      <Field label="What do you need?" htmlFor="q-title">
        <Input
          id="q-title"
          name="title"
          required
          minLength={3}
          maxLength={100}
          placeholder="e.g. Generator won't start"
        />
      </Field>
      <Field
        label="Details"
        htmlFor="q-details"
        hint="Make, size, what you've tried. Photos can follow in messages."
      >
        <Textarea
          id="q-details"
          name="details"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Area" htmlFor="q-area">
          <Select
            id="q-area"
            name="area"
            required
            defaultValue={
              (AREAS as readonly string[]).includes(provider.area)
                ? provider.area
                : ""
            }
          >
            <option value="" disabled>
              Choose area
            </option>
            {AREAS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </Select>
        </Field>
        <Field label="Preferred date" htmlFor="q-date" hint="Optional">
          <Input id="q-date" name="preferredDate" type="date" min={today} />
        </Field>
      </div>
      <Field label="Address" htmlFor="q-address">
        <Input
          id="q-address"
          name="address"
          required
          minLength={5}
          maxLength={200}
          placeholder="Street, estate, nearest landmark"
          autoComplete="street-address"
        />
      </Field>
      <FormMessage state={state} />
      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full"
        disabled={pending}
      >
        {pending ? "Sending…" : "Send request"}
      </Button>
    </form>
  );
}

/** Heart toggle. `variant="text"` renders a labelled button (used on the Saved page). */
export function SaveToggle({
  providerId,
  saved,
  variant = "icon",
}: {
  providerId: string;
  saved: boolean;
  variant?: "icon" | "text";
}) {
  const [pending, start] = useTransition();
  const [on, setOn] = useOptimistic(saved);
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    start(async () => {
      setOn(!on);
      const res = await toggleSavedAction(providerId);
      if (!res.ok) setError(res.error);
    });
  }

  const label = on ? "Remove from saved" : "Save artisan";
  return (
    <div className="relative">
      {variant === "icon" ? (
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          aria-pressed={on}
          aria-label={label}
          title={label}
          className={cn(
            "flex size-14 items-center justify-center rounded-full border transition-colors disabled:opacity-60",
            on
              ? "border-fg bg-fg text-bg"
              : "border-border-strong hover:border-fg",
          )}
        >
          <Heart className={cn("size-5", on && "fill-current")} />
        </button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          disabled={pending}
          aria-pressed={on}
        >
          <Heart className={cn(on && "fill-current")} />{" "}
          {pending ? "Saving…" : on ? "Remove" : "Save"}
        </Button>
      )}
      {error ? (
        <p
          role="alert"
          className="absolute right-0 top-full mt-1 w-56 text-right text-xs text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** "Book" on a fixed-price service: escrow breakdown + address/date → bookService. */
export function BookServiceButton({
  service,
  providerName,
  defaultArea,
  today,
}: {
  service: { id: string; name: string; price: number };
  providerName: string;
  defaultArea: string;
  today: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(bookServiceAction, null);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        aria-label={`Book ${service.name}`}
      >
        Book
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Book ${service.name}`}
        description={`with ${providerName}`}
      >
        <form action={action} className="space-y-5">
          <input type="hidden" name="serviceId" value={service.id} />

          <ol className="divide-y divide-border rounded-2xl border border-border">
            <li className="flex items-baseline justify-between gap-4 px-4 py-3">
              <span className="text-sm">
                <span className="eyebrow mr-2">01</span>You pay now
              </span>
              <span className="text-lg font-medium">
                {formatNaira(service.price)}
              </span>
            </li>
            <li className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
              <span>
                <span className="eyebrow mr-2">02</span>Held in escrow
              </span>
              <span className="text-muted">Not paid to the artisan yet</span>
            </li>
            <li className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
              <span>
                <span className="eyebrow mr-2">03</span>Released when you
                confirm
              </span>
              <span className="text-right text-muted">
                or {RULES.autoReleaseHours}h after they finish
              </span>
            </li>
          </ol>
          <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm">
            <span className="font-medium">Test mode: no real charge.</span>{" "}
            <span className="text-muted">
              Payments are simulated until card payments go live.
            </span>
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Area" htmlFor={`b-area-${service.id}`}>
              <Select
                id={`b-area-${service.id}`}
                name="area"
                required
                defaultValue={
                  (AREAS as readonly string[]).includes(defaultArea)
                    ? defaultArea
                    : ""
                }
              >
                <option value="" disabled>
                  Choose area
                </option>
                {AREAS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </Select>
            </Field>
            <Field
              label="Date"
              htmlFor={`b-date-${service.id}`}
              hint="Optional"
            >
              <Input
                id={`b-date-${service.id}`}
                name="scheduledFor"
                type="date"
                min={today}
              />
            </Field>
          </div>
          <Field label="Address" htmlFor={`b-address-${service.id}`}>
            <Input
              id={`b-address-${service.id}`}
              name="address"
              required
              minLength={5}
              maxLength={200}
              placeholder="Street, estate, nearest landmark"
              autoComplete="street-address"
            />
          </Field>
          <FormMessage state={state} />
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full"
            disabled={pending}
          >
            {pending
              ? "Funding escrow…"
              : `Pay ${formatNaira(service.price)} into escrow`}
          </Button>
        </form>
      </Modal>
    </>
  );
}

export function ReportArtisanButton({
  providerId,
  providerName,
}: {
  providerId: string;
  providerName: string;
}) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setFormKey((k) => k + 1);
          setOpen(true);
        }}
        className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-danger"
      >
        Report this artisan
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Report this artisan"
        description={`Tell us what happened with ${providerName}. They'll be able to respond, and our team decides.`}
      >
        <ReportForm
          key={formKey}
          providerId={providerId}
          onDone={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}

function ReportForm({
  providerId,
  onDone,
}: {
  providerId: string;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(reportProviderAction, null);
  return state?.ok ? (
    <div className="space-y-5">
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-2">
        <Link
          href="/account/reports"
          className={buttonVariants({ variant: "primary" })}
        >
          View my reports
        </Link>
        <Button variant="ghost" onClick={onDone}>
          Close
        </Button>
      </div>
    </div>
  ) : (
    <form action={action} className="space-y-5">
      <input type="hidden" name="providerId" value={providerId} />
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Reason</legend>
        <div className="grid gap-2">
          {REPORT_REASONS.map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm transition-colors has-checked:border-fg hover:border-border-strong"
            >
              <input
                type="radio"
                name="reason"
                value={r}
                required
                className="accent-fg"
              />
              {r}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="What happened?" htmlFor="r-notes">
        <Textarea
          id="r-notes"
          name="notes"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
        />
      </Field>
      <FormMessage state={state} />
      <Button
        type="submit"
        variant="danger"
        size="lg"
        className="w-full"
        disabled={pending}
      >
        {pending ? "Sending…" : "Send report"}
      </Button>
    </form>
  );
}
