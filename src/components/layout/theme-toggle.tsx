"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

export const THEME_KEY = "servhive_theme";

/** Inline, render-blocking: sets .dark before paint so there's no flash. */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;var c=document.documentElement.classList;if(d)c.add('dark');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)c.add('js-motion')}catch(e){}})()`;

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full transition-colors hover:bg-current/10",
        className,
      )}
    >
      <Sun className={cn("absolute size-[18px] transition-all duration-500 ease-out-expo", dark ? "translate-y-0 rotate-0 opacity-100" : "translate-y-6 rotate-90 opacity-0")} />
      <Moon className={cn("absolute size-[18px] transition-all duration-500 ease-out-expo", dark ? "-translate-y-6 -rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100")} />
    </button>
  );
}
