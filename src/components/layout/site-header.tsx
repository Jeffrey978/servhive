import { getSessionUser, homeFor } from "@/lib/auth";
import { HeaderBar } from "./header-bar";

/** Server wrapper: resolves who's signed in (DB role) and hands a narrow shape to the client bar. */
export async function SiteHeader() {
  const user = await getSessionUser();
  return (
    <HeaderBar
      session={
        user
          ? { name: user.name, dashboardHref: user.onboarded ? homeFor(user.role) : "/onboarding", role: user.role }
          : null
      }
    />
  );
}
