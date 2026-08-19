import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const audits = sqliteTable("audits", {
  id: text("id").primaryKey(), ownerId: text("owner_id").notNull(),
  areaCode: text("area_code").notNull(), status: text("status").notNull(),
  score: integer("score").notNull().default(0), criteriaVersion: text("criteria_version").notNull(),
  payload: text("payload").notNull(), updatedAt: text("updated_at").notNull(),
});
export const evidence = sqliteTable("evidence", {
  id: text("id").primaryKey(), auditId: text("audit_id").notNull(),
  criterionId: integer("criterion_id").notNull(), objectKey: text("object_key").notNull().unique(),
  filename: text("filename").notNull(), contentType: text("content_type").notNull(),
  uploadedBy: text("uploaded_by").notNull(), createdAt: text("created_at").notNull(),
});
export const workflowEvents = sqliteTable("workflow_events", {
  id: text("id").primaryKey(), auditId: text("audit_id").notNull(), actorId: text("actor_id").notNull(),
  eventType: text("event_type").notNull(), details: text("details").notNull(), createdAt: text("created_at").notNull(),
});
