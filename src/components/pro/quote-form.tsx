"use client";

import { useState } from "react";
import { RULES } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { ConfirmAction, FormMessage, useProAction, type FormAction } from "./form-bits";

/** Send / revise a quote with a live 5% breakdown, plus a two-step decline. */
export function QuoteForm({
  quoteId,
  sendAction,
  declineAction,
  initial,
}: {
  quoteId: string;
  sendAction: FormAction;
  declineAction: FormAction;
  initial?: { amount: number | null; duration: string | null; notes: string | null };
}) {
  const revising = !!initial?.amount;
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(initial?.amount ? String(initial.amount) : "");
  const { state, pending, onSubmit } = useProAction(sendAction);

  const value = Math.max(0, Math.round(Number(amount) || 0));
  const fee = Math.round((value * RULES.commissionPct) / 100);
  const net = value - fee;

  if (!open) {
    return (
      <div className="flex flex-wrap items-start gap-2">
        <Button size="sm" variant={revising ? "outline" : "primary"} onClick={() => setOpen(true)}>
          {revising ? "Revise quote" : "Send quote"}
        </Button>
        <ConfirmAction
          action={declineAction}
          fields={{ quoteId }}
          label="Decline"
          confirmLabel="Yes, decline"
          pendingLabel="Declining…"
          variant="ghost"
          confirmVariant="danger"
        />
        <FormMessage state={state} className="basis-full" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-bg p-4 md:p-5">
      <input type="hidden" name="quoteId" value={quoteId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your price (₦)" htmlFor={`amount-${quoteId}`}>
          <Input
            id={`amount-${quoteId}`}
            name="amount"
            inputMode="numeric"
            type="number"
            min={500}
            step={100}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="25000"
          />
        </Field>
        <Field label="Duration" htmlFor={`duration-${quoteId}`}>
          <Input
            id={`duration-${quoteId}`}
            name="duration"
            required
            maxLength={60}
            defaultValue={initial?.duration ?? ""}
            placeholder="e.g. 1 day, 3–4 hours"
          />
        </Field>
      </div>
      <Field label="Notes for the client" htmlFor={`notes-${quoteId}`} hint="What's included, materials, anything they should prepare.">
        <Textarea id={`notes-${quoteId}`} name="notes" rows={3} maxLength={1000} defaultValue={initial?.notes ?? ""} />
      </Field>

      <dl className="divide-y divide-border rounded-xl border border-border text-sm">
        <div className="flex justify-between px-4 py-2.5">
          <dt className="text-muted">Client pays into escrow</dt>
          <dd className="tabular-nums">{formatNaira(value)}</dd>
        </div>
        <div className="flex justify-between px-4 py-2.5">
          <dt className="text-muted">Servhive fee ({RULES.commissionPct}%)</dt>
          <dd className="tabular-nums">−{formatNaira(fee)}</dd>
        </div>
        <div className="flex justify-between px-4 py-2.5 font-medium">
          <dt>You receive</dt>
          <dd className="tabular-nums">{formatNaira(net)}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Sending…" : revising ? "Update quote" : "Send quote"}
        </Button>
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
