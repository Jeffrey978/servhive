import { redirect } from "next/navigation";
import { getSessionUser, homeFor } from "@/lib/auth";

/** Post-sign-in router: sends each user to the right home based on their DB role. */
export default async function ContinuePage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");
  redirect(user.onboarded ? homeFor(user.role) : "/onboarding");
}
