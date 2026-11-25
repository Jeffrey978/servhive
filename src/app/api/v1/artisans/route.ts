import type { NextRequest } from "next/server";
import { apiUser, handler, qp } from "@/server/api/http";
import { directory } from "@/server/api/queries";

export const dynamic = "force-dynamic";

/** The directory: same filters as /artisans (q, category, area, minRating, maxPrice, sort, near, landmark). */
export const GET = handler(async (req: NextRequest) => {
  await apiUser();
  const url = new URL(req.url);
  return directory({
    q: qp(url, "q", 80),
    category: qp(url, "category"),
    area: qp(url, "area"),
    minRating: qp(url, "minRating"),
    maxPrice: qp(url, "maxPrice"),
    sort: qp(url, "sort"),
    near: qp(url, "near"),
    landmark: qp(url, "landmark"),
  });
});
