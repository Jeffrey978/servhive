import type { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { JOB_STATUSES, ledgerSelect, ledgerWhere, pick, str } from "@/server/admin";

/** CSV export of the escrow ledger (respects the page's status + ref filters). Admin only. */
export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || !user.onboarded || user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const sp = request.nextUrl.searchParams;
  const where = ledgerWhere({ q: str(sp.get("q")), status: pick(sp.get("status"), JOB_STATUSES) });
  const jobs = await db.escrowJob.findMany({ where, orderBy: { createdAt: "desc" }, take: 10_000, select: ledgerSelect });

  const header = [
    "ref",
    "client",
    "artisan",
    "service",
    "area",
    "amount_ngn",
    "commission_pct",
    "commission_ngn",
    "payout_ngn",
    "status",
    "created_at",
    "marked_complete_at",
    "released_at",
    "auto_released",
  ];
  const lines = jobs.map((j) =>
    [
      j.ref,
      j.client.name,
      j.provider.businessName,
      j.serviceName,
      j.area,
      j.amount,
      j.commissionPct,
      j.commissionAmount,
      j.payoutAmount,
      j.status,
      j.createdAt.toISOString(),
      j.markedCompleteAt?.toISOString() ?? "",
      j.releasedAt?.toISOString() ?? "",
      j.autoReleased ? "yes" : "no",
    ]
      .map(cell)
      .join(","),
  );
  const body = "﻿" + [header.join(","), ...lines].join("\r\n") + "\r\n";
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="servhive-escrow-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

/** Quote a CSV cell and neutralise spreadsheet formula injection from user-entered text. */
function cell(v: string | number) {
  if (typeof v === "number") return String(v);
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}
