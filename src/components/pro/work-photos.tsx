"use client";

import Image from "next/image";
import { AREAS, RULES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { ConfirmAction, FormMessage, ImagePicker, useProAction, type FormAction } from "./form-bits";

export type PhotoRow = { id: string; url: string; caption: string; area: string | null };

export function WorkPhotos({
  photos,
  addAction,
  deleteAction,
}: {
  photos: PhotoRow[];
  addAction: FormAction;
  deleteAction: FormAction;
}) {
  const { state, pending, onSubmit, successKey } = useProAction(addAction);
  const enough = photos.length >= RULES.minWorkPhotosForReview;

  return (
    <div>
      <p className={cn("mb-4 text-sm", enough ? "text-muted" : "text-fg")}>
        <span className="font-mono">
          {photos.length}/{RULES.minWorkPhotosForReview}
        </span>{" "}
        {enough ? "Minimum met. More real jobs build more trust." : `Add at least ${RULES.minWorkPhotosForReview} photos of real jobs to submit for review.`}
      </p>

      {photos.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {photos.map((p) => (
            <li key={p.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-2">
                <Image src={p.url} alt={p.caption} fill unoptimized sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
              </div>
              <p className="mt-2 truncate text-sm font-medium">{p.caption}</p>
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-xs text-muted">{p.area ?? "Port Harcourt"}</p>
                <ConfirmAction
                  action={deleteAction}
                  fields={{ photoId: p.id }}
                  label="Delete"
                  confirmLabel="Delete"
                  pendingLabel="Deleting…"
                  variant="ghost"
                  confirmVariant="danger"
                  size="sm"
                  className="-mr-3 -mt-1.5 text-right"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <form key={successKey} onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-[14rem_1fr]">
        <ImagePicker id="work-photo" label="Choose a photo" />
        <div className="space-y-4">
          <Field label="Caption" htmlFor="wp-caption">
            <Input id="wp-caption" name="caption" required minLength={3} maxLength={120} placeholder="Changed 20KVA alternator, Woji" />
          </Field>
          <Field label="Area (optional)" htmlFor="wp-area">
            <Select id="wp-area" name="area" defaultValue="">
              <option value="">Not specified</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Uploading…" : "Add photo"}
            </Button>
            <FormMessage state={state} />
          </div>
        </div>
      </form>
    </div>
  );
}
