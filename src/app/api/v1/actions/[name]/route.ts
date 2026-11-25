import type { NextRequest } from "next/server";
import { apiUser, errorResponse, json } from "@/server/api/http";
import { ACTIONS, toFormData } from "@/server/api/actions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Run one named mutation (see ACTIONS). Responds with the action's own
 * result: 200 { ok: true, data?, message? } or 400 { ok: false, error }.
 */
export async function POST(req: NextRequest, ctx: RouteContext<"/api/v1/actions/[name]">) {
  try {
    const { name } = await ctx.params;
    const action = ACTIONS[name];
    if (!action) return json({ ok: false, error: "Unknown action." }, 404);
    await apiUser({ allowNotOnboarded: action.allowNotOnboarded });

    const type = req.headers.get("content-type") ?? "";
    const fd = type.includes("multipart/form-data") ? await req.formData() : toFormData(await req.json().catch(() => ({})));

    const result = await action.run(fd);
    return json(result, result.ok ? 200 : 400);
  } catch (e) {
    return errorResponse(e);
  }
}
