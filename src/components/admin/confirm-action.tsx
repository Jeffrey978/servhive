"use client";

import { useActionState, useId, useState } from "react";
import type { VariantProps } from "class-variance-authority";
import type { ActionResult } from "@/lib/action";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useFeedback } from "./feedback";

export type AdminAction = (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>;
type Variant = VariantProps<typeof buttonVariants>["variant"];

/**
 * Inline two-step confirm (no window.confirm). First click opens the confirm
 * step, optionally with a note field; the second click submits. Errors render
 * inline; success collapses the step and posts a notice.
 */
export function ConfirmAction({
  action,
  fields,
  label,
  confirmLabel,
  pendingLabel = "Working…",
  prompt,
  note,
  variant = "outline",
  confirmVariant = "primary",
  disabled,
  className,
}: {
  action: AdminAction;
  /** Hidden inputs sent with the form, e.g. { providerId }. */
  fields: Record<string, string>;
  label: string;
  confirmLabel?: string;
  pendingLabel?: string;
  /** One line explaining the consequence, shown in the confirm step. */
  prompt?: string;
  note?: { name: string; label: string; placeholder?: string; required?: boolean };
  variant?: Variant;
  confirmVariant?: Variant;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const notify = useFeedback();
  const noteId = useId();
  const [state, formAction, pending] = useActionState(async (prev: ActionResult | null, fd: FormData) => {
    const res = await action(prev, fd);
    if (res.ok) {
      setOpen(false);
      notify(res.message ?? "Done.");
    }
    return res;
  }, null);

  if (!open) {
    return (
      <div className={cn("inline-flex flex-col items-start gap-1.5", className)}>
        <Button size="sm" variant={variant} disabled={disabled} onClick={() => setOpen(true)}>
          {label}
        </Button>
        {state?.ok && state.message ? <p className="text-xs text-success">{state.message}</p> : null}
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className={cn("w-full space-y-3 rounded-2xl border border-border-strong bg-surface p-4 sm:max-w-md", className)}
    >
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {prompt ? <p className="text-sm text-muted">{prompt}</p> : null}
      {note ? (
        <div>
          <label htmlFor={noteId} className="mb-1.5 block text-sm font-medium">
            {note.label}
          </label>
          <Textarea
            id={noteId}
            name={note.name}
            rows={3}
            required={note.required}
            minLength={note.required ? 3 : undefined}
            maxLength={1000}
            placeholder={note.placeholder}
            className="text-sm"
          />
        </div>
      ) : null}
      {state && !state.ok ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" variant={confirmVariant} disabled={pending}>
          {pending ? pendingLabel : (confirmLabel ?? `Confirm ${label.toLowerCase()}`)}
        </Button>
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
