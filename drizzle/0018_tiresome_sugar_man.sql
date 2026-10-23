ALTER TABLE "experiences" ADD COLUMN "contributor" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "details" jsonb DEFAULT '{}'::jsonb NOT NULL;