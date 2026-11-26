import type { NextRequest } from "next/server";
import { apiUser, handler } from "@/server/api/http";
import { thread } from "@/server/api/queries";

export const dynamic = "force-dynamic";

/** One conversation; only its two participants can read it. */
export const GET = handler(async (_req: NextRequest, ctx: RouteContext<"/api/v1/messages/[id]">) => {
  const { id } = await ctx.params;
  return thread(await apiUser({ roles: ["CLIENT", "ARTISAN"] }), id);
});
