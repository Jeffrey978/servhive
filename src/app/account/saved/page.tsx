import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { isBoosted, providerCardSelect } from "@/server/providers";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { ProviderCard } from "@/components/provider-card";
import { SaveToggle } from "@/components/client/profile-actions";

export const metadata = { title: "Saved" };

export default async function SavedPage() {
  const user = await requireRole("CLIENT", "/account/saved");

  const saved = await db.savedProvider.findMany({
    where: { userId: user.id, provider: { status: "APPROVED" } },
    orderBy: { createdAt: "desc" },
    select: { providerId: true, provider: { select: providerCardSelect } },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Saved"
        title="Artisans you saved"
        description="Keep a shortlist for the next job."
      />
      {saved.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          body="Tap the heart on any artisan's profile to keep them here."
          action={
            <Link
              href="/artisans"
              className={buttonVariants({ variant: "accent" })}
            >
              Browse artisans
            </Link>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map(({ providerId, provider }) => (
            <li key={providerId}>
              <ProviderCard
                p={{ ...provider, boosted: isBoosted(provider) }}
                sizes="(min-width:1280px) 22vw, (min-width:640px) 40vw, 90vw"
              />
              <div className="mt-3 -ml-3">
                <SaveToggle providerId={providerId} saved variant="text" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
