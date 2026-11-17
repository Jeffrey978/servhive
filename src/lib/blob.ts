import "server-only";
import { put, del, get } from "@vercel/blob";

/**
 * Object storage for uploads (A.9). Two Vercel Blob stores:
 *   - PUBLIC  (BLOB_READ_WRITE_TOKEN):      work photos + profile photos — shown on
 *     public profiles, so a public URL is fine.
 *   - PRIVATE (DOCS_BLOB_READ_WRITE_TOKEN): government ID + trade licence — must never
 *     be a public link; stored by pathname and streamed to admins through a guarded
 *     route via a short-lived private read.
 *
 * Images arrive already downscaled from the browser (small JPEGs); we accept a data
 * URL or raw bytes and upload the bytes to Blob.
 */

const PUBLIC_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const DOCS_TOKEN = process.env.DOCS_BLOB_READ_WRITE_TOKEN;

export function publicBlobEnabled() {
  return !!PUBLIC_TOKEN;
}
export function docsBlobEnabled() {
  return !!DOCS_TOKEN;
}

/** Decode a `data:<mime>;base64,<...>` string to bytes + content type. */
export function dataUrlToBytes(dataUrl: string): { bytes: Buffer; contentType: string } {
  const m = /^data:([^;]+);base64,([\s\S]*)$/.exec(dataUrl);
  if (!m) throw new Error("Expected a base64 data URL.");
  return { bytes: Buffer.from(m[2]!, "base64"), contentType: m[1]! };
}

function extFor(contentType: string) {
  return contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
}

/** Upload a public image (work photo / profile photo). Returns its public URL. */
export async function uploadPublicImage(dataUrl: string, keyPrefix: string): Promise<string> {
  if (!PUBLIC_TOKEN) throw new Error("Public blob storage is not configured.");
  const { bytes, contentType } = dataUrlToBytes(dataUrl);
  const pathname = `${keyPrefix}/${crypto.randomUUID()}.${extFor(contentType)}`;
  const res = await put(pathname, bytes, {
    access: "public",
    contentType,
    token: PUBLIC_TOKEN,
    addRandomSuffix: false,
  });
  return res.url;
}

/** Upload a private document (ID / licence). Returns its pathname (never a public URL). */
export async function uploadPrivateDoc(dataUrl: string, keyPrefix: string): Promise<string> {
  if (!DOCS_TOKEN) throw new Error("Private document storage is not configured.");
  const { bytes, contentType } = dataUrlToBytes(dataUrl);
  const pathname = `${keyPrefix}/${crypto.randomUUID()}.${extFor(contentType)}`;
  const res = await put(pathname, bytes, {
    access: "private",
    contentType,
    token: DOCS_TOKEN,
    addRandomSuffix: false,
  });
  // Store the pathname, not a URL — the file is only ever read back through getPrivateDoc.
  return res.pathname;
}

/** Stream a private document's bytes (admin-only callers). Null if missing. */
export async function getPrivateDoc(pathname: string) {
  if (!DOCS_TOKEN) throw new Error("Private document storage is not configured.");
  const res = await get(pathname, { access: "private", token: DOCS_TOKEN });
  if (!res || res.statusCode !== 200) return null;
  return { stream: res.stream, contentType: res.blob.contentType, size: res.blob.size };
}

/** Best-effort delete; never throws (cleanup must not break the main flow). */
export async function deletePublicImage(url: string) {
  if (!PUBLIC_TOKEN) return;
  await del(url, { token: PUBLIC_TOKEN }).catch(() => {});
}
export async function deletePrivateDoc(pathname: string) {
  if (!DOCS_TOKEN) return;
  await del(pathname, { token: DOCS_TOKEN }).catch(() => {});
}

/** A stored value is a legacy inline data URL (pre-Blob) rather than a Blob reference. */
export function isDataUrl(v: string | null | undefined): v is string {
  return !!v && v.startsWith("data:");
}
