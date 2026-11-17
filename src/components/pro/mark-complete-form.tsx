"use client";

import { useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { downscaleToDataUrl } from "@/lib/image-client";
import { Button } from "@/components/ui/button";
import { FormMessage, useProAction, type FormAction } from "./form-bits";

/**
 * Mark a job complete with proof-of-work photos (A.6). At least one photo is
 * required before the 48h auto-release window starts, so the client has evidence.
 * Photos are downscaled in the browser and sent as data URLs; the server action
 * uploads them to Blob.
 */
export function MarkCompleteForm({ action, jobId }: { action: FormAction; jobId: string }) {
  const { state, pending, onSubmit } = useProAction(action);
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MAX = 6;

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-picking the same file
    if (files.length === 0) return;
    setError(null);
    setBusy(true);
    try {
      const next: string[] = [];
      for (const file of files) {
        if (photos.length + next.length >= MAX) break;
        if (!file.type.startsWith("image/")) continue;
        const url = await downscaleToDataUrl(file);
        if (url.length > 2_000_000) throw new Error("One photo is too large. Try a smaller image.");
        next.push(url);
      }
      setPhotos((p) => [...p, ...next].slice(0, MAX));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read that image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full md:max-w-xs">
      <input type="hidden" name="jobId" value={jobId} />
      {photos.map((p, i) => (
        <input key={i} type="hidden" name="photos" value={p} />
      ))}

      <p className="mb-2 text-sm font-medium">Photos of the finished work</p>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-2">
            <Image src={p} alt={`Completion photo ${i + 1}`} fill unoptimized sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => setPhotos((arr) => arr.filter((_, j) => j !== i))}
              aria-label="Remove photo"
              className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        {photos.length < MAX ? (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-strong bg-surface-2 text-center text-xs text-muted transition-colors hover:border-fg">
            <ImagePlus className="size-4" strokeWidth={1.6} />
            {busy ? "…" : "Add"}
            <input type="file" accept="image/*" multiple className="sr-only" onChange={onPick} />
          </label>
        ) : null}
      </div>
      <p className="mt-1.5 text-xs text-muted">At least one photo. Take a photo or choose from your gallery.</p>

      <div className="mt-3 flex flex-col items-start gap-2">
        <Button type="submit" variant="primary" size="sm" disabled={pending || busy || photos.length === 0}>
          {pending ? "Saving…" : "Mark work complete"}
        </Button>
        {error ? <p className="text-sm text-danger">{error}</p> : <FormMessage state={state} />}
      </div>
    </form>
  );
}
