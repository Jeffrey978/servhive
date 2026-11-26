import { apiUser, handler } from "@/server/api/http";
import { conversations } from "@/server/api/queries";

export const dynamic = "force-dynamic";

/** Inbox for either side. */
export const GET = handler(async () => conversations(await apiUser({ roles: ["CLIENT", "ARTISAN"] })));
