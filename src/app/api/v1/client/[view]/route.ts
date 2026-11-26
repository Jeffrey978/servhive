import type { NextRequest } from "next/server";
import { HttpError, apiUser, handler } from "@/server/api/http";
import { clientJobs, clientOverview, clientQuotes, clientReports, clientSaved } from "@/server/api/queries";
import type { User } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const VIEWS: Record<string, (user: User) => Promise<unknown>> = {
  overview: clientOverview,
  jobs: clientJobs,
  quotes: clientQuotes,
  reports: clientReports,
  saved: clientSaved,
};

/** The client's account screens: overview, jobs, quotes, reports, saved. */
export const GET = handler(async (_req: NextRequest, ctx: RouteContext<"/api/v1/client/[view]">) => {
  const { view } = await ctx.params;
  const load = VIEWS[view];
  if (!load) throw new HttpError(404, "Not found.");
  return load(await apiUser({ roles: ["CLIENT"] }));
});
