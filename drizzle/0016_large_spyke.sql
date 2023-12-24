ALTER TABLE "goal" ADD COLUMN "streakUpdatedAt" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "timezone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "streak";