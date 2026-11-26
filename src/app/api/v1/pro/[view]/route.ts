import type { NextRequest } from "next/server";
import { HttpError, apiUser, handler } from "@/server/api/http";
import {
  proBilling,
  proComplaints,
  proJobs,
  proOverview,
  proPayout,
  proProfile,
  proRequests,
  proVerification,
} from "@/server/api/queries";
import type { User } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const VIEWS: Record<string, (user: User) => Promise<unknown>> = {
  overview: proOverview,
  requests: proRequests,
  jobs: proJobs,
  complaints: proComplaints,
  billing: proBilling,
  payout: proPayout,
  profile: proProfile,
  verification: proVerification,
};

/** The artisan's Pro screens. */
export const GET = handler(async (_req: NextRequest, ctx: RouteContext<"/api/v1/pro/[view]">) => {
  const { view } = await ctx.params;
  const load = VIEWS[view];
  if (!load) throw new HttpError(404, "Not found.");
  return load(await apiUser({ roles: ["ARTISAN"] }));
});
