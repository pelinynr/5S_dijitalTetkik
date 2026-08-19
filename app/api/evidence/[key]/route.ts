import { bucket } from "../../_storage";

export async function GET(_request: Request, context: { params: Promise<{ key: string }> }) {
  const { key } = await context.params, normalized = key.replaceAll("-", "+").replaceAll("_", "/"), objectKey = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")), object = await bucket().get(objectKey);
  if (!object) return new Response("Bulunamadı", { status: 404 });
  const headers = new Headers(); object.writeHttpMetadata(headers); headers.set("etag", object.httpEtag); headers.set("cache-control", "private, max-age=3600");
  return new Response(object.body, { headers });
}
