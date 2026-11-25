import type { NextRequest } from "next/server";
import { apiUser, handler } from "@/server/api/http";
import { artisanProfile } from "@/server/api/queries";

export const dynamic = "force-dynamic";

/** One artisan's public profile (or the owner's preview of their own). */
export const GET = handler(async (_req: NextRequest, ctx: RouteContext<"/api/v1/artisans/[slug]">) => {
  const { slug } = await ctx.params;
  return artisanProfile(await apiUser(), slug);
});
