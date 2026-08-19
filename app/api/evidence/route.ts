import { AUDIT_ID, bucket, ensureSchema, userId } from "../_storage";

export async function POST(request: Request) {
  const form = await request.formData(), file = form.get("file"), criterionId = Number(form.get("criterionId"));
  if (!(file instanceof File) || !Number.isInteger(criterionId)) return Response.json({ error: "Fotoğraf ve kriter zorunludur" }, { status: 400 });
  if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) return Response.json({ error: "Yalnızca 10 MB altındaki görseller kabul edilir" }, { status: 400 });
  const id = crypto.randomUUID(), key = `${AUDIT_ID}/${criterionId}/${id}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`, now = new Date().toISOString();
  await bucket().put(key, file.stream(), { httpMetadata: { contentType: file.type }, customMetadata: { auditId: AUDIT_ID, criterionId: String(criterionId) } });
  const db = await ensureSchema();
  await db.prepare("INSERT INTO evidence (id, audit_id, criterion_id, object_key, filename, content_type, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(id, AUDIT_ID, criterionId, key, file.name, file.type, userId(request), now).run();
  const token = btoa(key).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  return Response.json({ ok: true, url: `/api/evidence/${token}` });
}
