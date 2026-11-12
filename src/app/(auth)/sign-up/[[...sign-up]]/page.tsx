import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Create your account" };

export default async function SignUpPage({ searchParams }: PageProps<"/sign-up/[[...sign-up]]">) {
  const { as } = await searchParams;
  const pro = as === "pro";
  return (
    <div>
      <p className="eyebrow mb-4 text-center">{pro ? "Join as a pro" : "Hire with confidence"}</p>
      {/* Role is chosen on /onboarding and stored in our DB — never in Clerk metadata. */}
      <SignUp path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl={pro ? "/onboarding?as=pro" : "/onboarding"} />
    </div>
  );
}
