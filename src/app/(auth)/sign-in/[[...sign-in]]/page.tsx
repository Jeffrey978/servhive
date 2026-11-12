import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  // After sign-in Clerk honours ?redirect_url=…, otherwise /continue routes by DB role.
  return <SignIn path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/continue" />;
}
