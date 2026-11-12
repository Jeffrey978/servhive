"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Success notices that outlive the button that triggered them. An action that
 * approves or suspends usually removes its own button on revalidation, so the
 * confirmation is shown here (the admin layout persists across navigations).
 */
const FeedbackContext = createContext<(message: string) => void>(() => {});

export function useFeedback() {
  return useContext(FeedbackContext);
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<{ id: number; text: string } | null>(null);
  const notify = useCallback((text: string) => setNotice({ id: Date.now(), text }), []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <FeedbackContext.Provider value={notify}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center md:inset-x-auto md:right-6 md:bottom-6">
        {notice ? (
          <div
            key={notice.id}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-border-strong bg-fg px-4 py-3 text-sm text-bg"
          >
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" aria-hidden />
            <p className="flex-1">{notice.text}</p>
            <button type="button" onClick={() => setNotice(null)} className="-mr-1 opacity-60 hover:opacity-100" aria-label="Dismiss">
              <X className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </FeedbackContext.Provider>
  );
}
