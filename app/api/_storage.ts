import { env } from "cloudflare:workers";

export const AUDIT_ID = "TTK-2026-0142";

export function userId(request: Request) {
  return request.headers.get("oai-authenticated-user-id") || "local-demo-user";
}

export async function ensureSchema() {
  const db = env.DB;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS audits (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, area_code TEXT NOT NULL, status TEXT NOT NULL, score INTEGER NOT NULL DEFAULT 0, criteria_version TEXT NOT NULL, payload TEXT NOT NULL, updated_at TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS evidence (id TEXT PRIMARY KEY, audit_id TEXT NOT NULL, criterion_id INTEGER NOT NULL, object_key TEXT NOT NULL UNIQUE, filename TEXT NOT NULL, content_type TEXT NOT NULL, uploaded_by TEXT NOT NULL, created_at TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS workflow_events (id TEXT PRIMARY KEY, audit_id TEXT NOT NULL, actor_id TEXT NOT NULL, event_type TEXT NOT NULL, details TEXT NOT NULL, created_at TEXT NOT NULL)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_audits_owner_updated ON audits(owner_id, updated_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_evidence_audit_criterion ON evidence(audit_id, criterion_id)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_workflow_audit_created ON workflow_events(audit_id, created_at)`),
  ]);
  return db;
}

export function bucket() { return env.EVIDENCE as R2Bucket; }
