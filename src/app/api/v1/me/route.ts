import { apiUser, handler } from "@/server/api/http";
import { me } from "@/server/api/queries";

export const dynamic = "force-dynamic";

/** Who is signed in. Works before onboarding, so the app knows to show the set-up screens. */
export const GET = handler(async () => me(await apiUser({ allowNotOnboarded: true })));
