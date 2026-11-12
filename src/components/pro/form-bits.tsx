"use client";

import { startTransition, useActionState, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Check, ImagePlus } from "lucide-react";
import Image from "next/image";
import type { ActionResult } from "@/lib/action";
import { downscaleToDataUrl } from "@/lib/image-client";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FormAction = (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>;

/**
 * useActionState wrapper that submits via onSubmit (so React doesn't reset the
 * form when validation fails) and exposes a `successKey` that bumps on every
 * successful submit — put it on a `key` to clear "add" forms after success.
 */
type ProActionState = { result: ActionResult | null; n: number };
const INITIAL: ProActionState = { result: null, n: 0 };

export function useProAction(action: FormAction) {
  const [s, dispatch, pending] = useActionState(async (prev: ProActionState, fd: FormData): Promise<ProActionState> => {
    const result = await action(prev.result, fd);
    return { result, n: result.ok ? prev.n + 1 : prev.n };
  }, INITIAL);
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  }
  return { state: s.result, pending, onSubmit, successKey: s.n };
}

export function FormMessage({ state, className }: { state: ActionResult | null; className?: string }) {
  if (!state) return null;
  return (
    <p role="status" aria-live="polite" className={cn("text-sm", state.ok ? "text-success" : "text-danger", className)}>
      {state.ok ? (
        <span className="inline-flex items-center gap-1.5">
          <Check className="size-3.5" /> {state.message ?? "Saved."}
        </span>
      ) : (
        state.error
      )}
    </p>
  );
}

/**
 * Inline two-step button for irreversible actions (no window.confirm).
 * First click arms it; the second submits. Any result disarms it again.
 */
export function ConfirmAction({
  action,
  fields,
  label,
  confirmLabel,
  pendingLabel = "Working…",
  prompt,
  variant = "outline",
  confirmVariant = "primary",
  size = "sm",
  disabled,
  className,
}: {
  action: FormAction;
  fields?: Record<string, string>;
  label: ReactNode;
  confirmLabel: ReactNode;
  pendingLabel?: ReactNode;
  prompt?: ReactNode;
  variant?: ButtonProps["variant"];
  confirmVariant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  disabled?: boolean;
  className?: string;
}) {
  const { state, pending, onSubmit } = useProAction(action);
  // Armed only while the result hasn't changed since the user armed it.
  const [armedFor, setArmedFor] = useState<{ v: ActionResult | null } | null>(null);
  const armed = armedFor !== null && armedFor.v === state;

  return (
    <form onSubmit={onSubmit} className={cn("space-y-2", className)}>
      {fields ? Object.entries(fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />) : null}
      {!armed ? (
        <Button variant={variant} size={size} disabled={disabled} onClick={() => setArmedFor({ v: state })}>
          {label}
        </Button>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {prompt ? <span className="text-sm text-muted">{prompt}</span> : null}
          <Button type="submit" variant={confirmVariant} size={size} disabled={pending}>
            {pending ? pendingLabel : confirmLabel}
          </Button>
          <Button variant="ghost" size={size} disabled={pending} onClick={() => setArmedFor(null)}>
            Cancel
          </Button>
        </div>
      )}
      <FormMessage state={state} />
    </form>
  );
}

/**
 * File input → downscaled JPEG data URL in a hidden `dataUrl` field (plus `fileName`).
 * No object storage yet, so the data URL is what gets stored.
 */
export function ImagePicker({
  label = "Choose image",
  initialUrl,
  aspect = "aspect-[4/3]",
  round,
  id,
}: {
  label?: string;
  initialUrl?: string | null;
  aspect?: string;
  round?: boolean;
  id: string;
}) {
  const [dataUrl, setDataUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const preview = dataUrl || initialUrl || null;

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setBusy(true);
    try {
      const url = await downscaleToDataUrl(file);
      if (url.length > 2_000_000) throw new Error("That image is too large. Try a smaller photo.");
      setDataUrl(url);
      setFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read that image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "group relative flex cursor-pointer items-center justify-center overflow-hidden border border-dashed border-border-strong bg-surface-2 transition-colors hover:border-fg",
          round ? "size-24 rounded-full" : cn("w-full rounded-card", aspect),
        )}
      >
        {preview ? (
          <Image src={preview} alt="" fill unoptimized sizes="320px" className="object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 p-4 text-center text-sm text-muted">
            <ImagePlus className="size-5" strokeWidth={1.6} />
            {busy ? "Processing…" : label}
          </span>
        )}
        {preview ? (
          <span className="absolute inset-x-0 bottom-0 bg-black/40 py-1.5 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {busy ? "Processing…" : "Change"}
          </span>
        ) : null}
        <input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/*" className="sr-only" onChange={onChange} />
      </label>
      <input type="hidden" name="dataUrl" value={dataUrl} />
      <input type="hidden" name="fileName" value={fileName} />
      {error ? <p className="mt-1.5 text-sm text-danger">{error}</p> : null}
    </div>
  );
}

/** Single-click action button (for non-destructive actions like "Submit for review"). */
export function ActionButton({
  action,
  label,
  pendingLabel = "Working…",
  variant = "primary",
  size = "md",
  disabled,
}: {
  action: FormAction;
  label: ReactNode;
  pendingLabel?: ReactNode;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  disabled?: boolean;
}) {
  const { state, pending, onSubmit } = useProAction(action);
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Button type="submit" variant={variant} size={size} disabled={disabled || pending}>
        {pending ? pendingLabel : label}
      </Button>
      <FormMessage state={state} />
    </form>
  );
}
