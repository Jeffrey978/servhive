import { apiUser, handler } from "@/server/api/http";
import { meta } from "@/server/api/queries";

export const dynamic = "force-dynamic";

/** Areas, trades, banks, report reasons and business rules for the app's forms. */
export const GET = handler(async () => {
  await apiUser({ allowNotOnboarded: true });
  return meta();
});
