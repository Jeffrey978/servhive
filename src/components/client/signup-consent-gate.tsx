"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * First-screen legal consent (A.2). Shown before Clerk's <SignUp> widget: the
 * user must confirm 18+ and accept the three legal documents before the actual
 * sign-up form is revealed. Clerk's authentication is left completely untouched.
 *
 * The decision is stored in sessionStorage so it survives Clerk's OTP step and a
 * refresh within the same sign-up attempt. The role-specific consent on
 * /onboarding remains the final, server-enforced gate.
 */

const KEY = "servhive_signup_consent";

// Minimal external store over sessionStorage so we read consent during render
// (no setState-in-effect) and stay SSR-safe: the server snapshot is always false.
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  try {
    return sessionStorage.getItem(KEY) === "yes";
  } catch {
    return false; // private mode / storage blocked → show the gate
  }
}
function setConsent() {
  try {
    sessionStorage.setItem(KEY, "yes");
  } catch {
    // Non-fatal: proceed for this session even if we couldn't persist it.
  }
  listeners.forEach((cb) => cb());
}

function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-2 hover:text-accent">
      {children}
    </Link>
  );
}

export function SignupConsentGate({ children }: { children: ReactNode }) {
  const accepted = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);

  function confirm() {
    if (!checked) {
      setError(true);
      return;
    }
    setConsent();
  }

  if (accepted) return <>{children}</>;

  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h2 className="text-lg font-medium">Before you create an account</h2>
      <p className="mt-2 text-sm text-muted">Please confirm the following to continue.</p>

      <label className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-bg p-4 text-sm leading-relaxed text-muted">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            if (e.target.checked) setError(false);
          }}
          className="mt-0.5 size-4 shrink-0 rounded border-border accent-accent"
        />
        <span>
          I am 18 or over and I accept the <LegalLink href="/legal/terms">Terms of Use</LegalLink>, the{" "}
          <LegalLink href="/legal/protection">Payment Protection Terms</LegalLink> and the{" "}
          <LegalLink href="/legal/privacy">Privacy Policy</LegalLink>.
        </span>
      </label>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          Please confirm you are 18 or over and accept the terms to continue.
        </p>
      ) : null}

      <Button variant="primary" size="lg" className="mt-5 w-full" onClick={confirm}>
        Continue to sign up
        <ArrowRight />
      </Button>

      <p className="mt-4 text-center text-xs text-muted">
        Providers also accept the{" "}
        <LegalLink href="/legal/provider">Provider Agreement</LegalLink> when setting up their profile.
      </p>
    </div>
  );
}
