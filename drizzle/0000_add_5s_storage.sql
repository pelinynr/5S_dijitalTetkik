CREATE TABLE `audits` (
  `id` text PRIMARY KEY NOT NULL,
  `owner_id` text NOT NULL,
  `area_code` text NOT NULL,
  `status` text NOT NULL,
  `score` integer DEFAULT 0 NOT NULL,
  `criteria_version` text NOT NULL,
  `payload` text NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `evidence` (
  `id` text PRIMARY KEY NOT NULL,
  `audit_id` text NOT NULL,
  `criterion_id` integer NOT NULL,
  `object_key` text NOT NULL,
  `filename` text NOT NULL,
  `content_type` text NOT NULL,
  `uploaded_by` text NOT NULL,
  `created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evidence_object_key_unique` ON `evidence` (`object_key`);
--> statement-breakpoint
CREATE TABLE `workflow_events` (
  `id` text PRIMARY KEY NOT NULL,
  `audit_id` text NOT NULL,
  `actor_id` text NOT NULL,
  `event_type` text NOT NULL,
  `details` text NOT NULL,
  `created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audits_owner_updated` ON `audits` (`owner_id`,`updated_at`);
--> statement-breakpoint
CREATE INDEX `idx_evidence_audit_criterion` ON `evidence` (`audit_id`,`criterion_id`);
--> statement-breakpoint
CREATE INDEX `idx_workflow_audit_created` ON `workflow_events` (`audit_id`,`created_at`);
