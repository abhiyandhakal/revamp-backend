ALTER TABLE "account" ADD COLUMN "streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "streakUpdatedAt" timestamp;