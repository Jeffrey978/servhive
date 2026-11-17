import type { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPrivateDoc, isDataUrl, dataUrlToBytes } from "@/lib/blob";

/**
 * Streams a provider's private verification document (ID / licence) to ADMINS only
 * (A.9). The document's bytes live in the private Blob store and are never exposed
 * as a public URL; this route is the only way to view them, behind an admin check.
 *
 * Legacy records still hold an inline data URL in fileUrl — those are decoded and
 * streamed here too, so old uploads keep working.
 */

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || !user.onboarded || user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;
  const doc = await db.verificationDocument.findUnique({ where: { id }, select: { fileUrl: true } });
  if (!doc) return new Response("Not found", { status: 404 });

  // Legacy inline data URL.
  if (isDataUrl(doc.fileUrl)) {
    const { bytes, contentType } = dataUrlToBytes(doc.fileUrl);
    return new Response(new Uint8Array(bytes), {
      headers: { "Content-Type": contentType, "Cache-Control": "private, no-store" },
    });
  }

  // Blob pathname → private read.
  try {
    const file = await getPrivateDoc(doc.fileUrl);
    if (!file) return new Response("Not found", { status: 404 });
    return new Response(file.stream, {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Unable to load document", { status: 500 });
  }
}
