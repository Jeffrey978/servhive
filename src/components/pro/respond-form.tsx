"use client";

import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { FormMessage, useProAction, type FormAction } from "./form-bits";

/** One-time artisan response to a complaint. */
export function RespondForm({ reportId, action }: { reportId: string; action: FormAction }) {
  const { state, pending, onSubmit } = useProAction(action);
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="reportId" value={reportId} />
      <Field label="Your response" htmlFor={`resp-${reportId}`} hint="Stick to facts: dates, what was agreed, what happened. You can respond once.">
        <Textarea id={`resp-${reportId}`} name="response" rows={4} required minLength={10} maxLength={1500} />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Sending…" : "Send response"}
        </Button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
