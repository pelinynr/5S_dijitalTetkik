import { AUDIT_ID, ensureSchema, userId } from "../../_storage";

export async function GET(request: Request) {
  const db = await ensureSchema();
  const row = await db.prepare("SELECT payload, score, status, updated_at FROM audits WHERE id = ? AND owner_id = ?").bind(AUDIT_ID, userId(request)).first();
  return Response.json({ audit: row ? { ...row, payload: JSON.parse(String(row.payload)) } : null });
}

export async function POST(request: Request) {
  const owner = userId(request), body = await request.json() as { rows: unknown[]; score: number; issueState: string; planPublished: boolean };
  if (!Array.isArray(body.rows) || !Number.isFinite(body.score)) return Response.json({ error: "Geçersiz tetkik verisi" }, { status: 400 });
  const now = new Date().toISOString(), db = await ensureSchema(), payload = JSON.stringify({ rows: body.rows, issueState: body.issueState, planPublished: body.planPublished });
  await db.prepare(`INSERT INTO audits (id, owner_id, area_code, status, score, criteria_version, payload, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET owner_id=excluded.owner_id, status=excluded.status, score=excluded.score, payload=excluded.payload, updated_at=excluded.updated_at`).bind(AUDIT_ID, owner, "A-01", "draft", Math.round(body.score), "v3.1", payload, now).run();
  await db.prepare("INSERT INTO workflow_events (id, audit_id, actor_id, event_type, details, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(crypto.randomUUID(), AUDIT_ID, owner, "draft_saved", JSON.stringify({ score: body.score }), now).run();
  return Response.json({ ok: true, updatedAt: now });
}
