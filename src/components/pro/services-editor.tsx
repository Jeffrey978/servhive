"use client";

import { useState } from "react";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { PRICE_TYPES } from "./constants";
import { ConfirmAction, FormMessage, useProAction, type FormAction } from "./form-bits";

export type ServiceRow = { id: string; name: string; price: number; priceType: string; unitLabel: string | null };

function priceLabel(s: ServiceRow) {
  const p = formatNaira(s.price);
  if (s.priceType === "STARTING_FROM") return `From ${p}`;
  if (s.priceType === "PER_UNIT") return `${p} / ${s.unitLabel ?? "unit"}`;
  if (s.priceType === "MILESTONE") return `${p} per milestone`;
  return p;
}

export function ServicesEditor({
  services,
  saveAction,
  deleteAction,
}: {
  services: ServiceRow[];
  saveAction: FormAction;
  deleteAction: FormAction;
}) {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div>
      {services.length === 0 ? (
        <p className="border-y border-border py-6 text-sm text-muted">No services yet. Add the jobs clients book most often.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {services.map((s) =>
            editing === s.id ? (
              <li key={s.id} className="py-4">
                <ServiceForm action={saveAction} initial={s} onDone={() => setEditing(null)} />
              </li>
            ) : (
              <li key={s.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{s.name}</p>
                  <p className="text-sm text-muted tabular-nums">{priceLabel(s)}</p>
                </div>
                <div className="flex items-start gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(s.id)}>
                    Edit
                  </Button>
                  <ConfirmAction
                    action={deleteAction}
                    fields={{ serviceId: s.id }}
                    label="Remove"
                    confirmLabel="Remove"
                    pendingLabel="Removing…"
                    variant="ghost"
                    confirmVariant="danger"
                  />
                </div>
              </li>
            ),
          )}
        </ul>
      )}
      <div className="mt-6">
        <p className="eyebrow mb-3">Add a service</p>
        <ServiceForm action={saveAction} />
      </div>
    </div>
  );
}

function ServiceForm({ action, initial, onDone }: { action: FormAction; initial?: ServiceRow; onDone?: () => void }) {
  const { state, pending, onSubmit, successKey } = useProAction(action);
  const [type, setType] = useState(initial?.priceType ?? "FIXED");
  const idp = initial?.id ?? "new";

  return (
    <form key={initial ? undefined : successKey} onSubmit={onSubmit} className="space-y-4">
      {initial ? <input type="hidden" name="serviceId" value={initial.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
        <Field label="Service" htmlFor={`svc-name-${idp}`}>
          <Input id={`svc-name-${idp}`} name="name" required maxLength={80} defaultValue={initial?.name} placeholder="Generator servicing" />
        </Field>
        <Field label="Price (₦)" htmlFor={`svc-price-${idp}`}>
          <Input
            id={`svc-price-${idp}`}
            name="price"
            type="number"
            inputMode="numeric"
            min={500}
            step={100}
            required
            defaultValue={initial?.price}
          />
        </Field>
        <Field label="Pricing" htmlFor={`svc-type-${idp}`}>
          <Select id={`svc-type-${idp}`} name="priceType" value={type} onChange={(e) => setType(e.target.value)}>
            {PRICE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {type === "PER_UNIT" ? (
        <Field label="Unit" htmlFor={`svc-unit-${idp}`} hint="What one unit is: room, door, garment…" className="max-w-xs">
          <Input id={`svc-unit-${idp}`} name="unitLabel" required maxLength={30} defaultValue={initial?.unitLabel ?? ""} placeholder="room" />
        </Field>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm" variant={initial ? "primary" : "outline"} disabled={pending}>
          {pending ? "Saving…" : initial ? "Save changes" : "Add service"}
        </Button>
        {onDone ? (
          <Button size="sm" variant="ghost" disabled={pending} onClick={onDone}>
            Done
          </Button>
        ) : null}
        <FormMessage state={state} />
      </div>
    </form>
  );
}
