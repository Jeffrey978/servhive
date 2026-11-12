import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser, homeFor } from "@/lib/auth";
import { db } from "@/lib/db";
import { AREAS } from "@/lib/constants";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Set up your account" };

export default async function OnboardingPage({ searchParams }: PageProps<"/onboarding">) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?redirect_url=/onboarding");
  if (user.onboarded) redirect(homeFor(user.role));

  const { as } = await searchParams;
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, requiresLicence: true },
  });

  return (
    <OnboardingForm
      defaultRole={as === "pro" ? "ARTISAN" : null}
      defaultName={user.name}
      categories={categories}
      areas={[...AREAS]}
    />
  );
}
