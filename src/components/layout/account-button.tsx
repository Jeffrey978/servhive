"use client";

import { useSyncExternalStore } from "react";
import { UserButton } from "@clerk/nextjs";

const subscribe = () => () => {};

/**
 * Clerk's <UserButton> renders nothing on the server but a host <div> on the client,
 * which breaks hydration of whatever contains it. Mount it only after hydration and
 * hold its space with a same-size placeholder so the header doesn't shift.
 */
export function AccountButton() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  if (!hydrated) return <span aria-hidden className="block size-7 rounded-full bg-surface-2" />;
  return <UserButton />;
}
