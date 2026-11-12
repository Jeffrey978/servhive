import Link from "next/link";
import { EmptyState } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button";

/** Edge case: an ARTISAN user without a Provider row (onboarding interrupted). */
export function NoProvider() {
  return (
    <EmptyState
      title="Your pro profile isn't set up yet"
      body="Finish onboarding to create your business profile and start your free trial."
      action={
        <Link href="/onboarding" className={buttonVariants({ variant: "primary" })}>
          Finish onboarding
        </Link>
      }
    />
  );
}
