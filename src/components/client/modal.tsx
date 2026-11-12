"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible modal built on native <dialog> (focus trap, Esc and inert background for free).
 * Bottom sheet on phones, centred panel from `sm` up.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself, outside the panel) closes.
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-full overflow-hidden rounded-t-card border border-border bg-surface p-0 text-fg backdrop:bg-black/60",
        "sm:m-auto sm:max-w-lg sm:rounded-card",
        "transition-[opacity,translate] duration-300 ease-out-expo starting:open:translate-y-6 starting:open:opacity-0",
        className,
      )}
    >
      <div
        data-lenis-prevent
        className="max-h-[92dvh] overflow-y-auto overscroll-contain"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-h3 font-medium">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1 text-sm text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 flex size-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
      </div>
    </dialog>
  );
}

/** Inline result line for useActionState results. */
export function FormMessage({
  state,
}: {
  state: { ok: boolean; error?: string; message?: string } | null;
}) {
  if (!state) return null;
  if (!state.ok) {
    return (
      <p
        role="alert"
        className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger"
      >
        {state.error}
      </p>
    );
  }
  if (state.message) {
    return (
      <p
        role="status"
        className="rounded-xl bg-success-soft px-4 py-3 text-sm text-success"
      >
        {state.message}
      </p>
    );
  }
  return null;
}
