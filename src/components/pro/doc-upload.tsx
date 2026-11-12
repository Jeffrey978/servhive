"use client";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { FormMessage, ImagePicker, useProAction, type FormAction } from "./form-bits";

/** Upload (or replace) one verification document as a downscaled image. */
export function DocUpload({
  kind,
  action,
  hasExisting,
  licenceNumber,
}: {
  kind: "GOVERNMENT_ID" | "TRADE_LICENCE";
  action: FormAction;
  hasExisting: boolean;
  licenceNumber?: string | null;
}) {
  const { state, pending, onSubmit, successKey } = useProAction(action);
  const slug = kind.toLowerCase();

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-[12rem_1fr] sm:items-end">
      <input type="hidden" name="kind" value={kind} />
      <div key={successKey}>
        <ImagePicker id={`doc-${slug}`} label={hasExisting ? "Choose a new image" : "Choose an image"} aspect="aspect-[3/2]" />
      </div>
      <div className="space-y-4">
        {kind === "TRADE_LICENCE" ? (
          <Field label="Licence number" htmlFor="licenceNumber">
            <Input id="licenceNumber" name="licenceNumber" required minLength={3} maxLength={60} defaultValue={licenceNumber ?? ""} />
          </Field>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="sm" variant="outline" disabled={pending}>
            {pending ? "Uploading…" : hasExisting ? "Replace document" : "Upload document"}
          </Button>
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  );
}
