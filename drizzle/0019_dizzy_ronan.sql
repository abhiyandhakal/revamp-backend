ALTER TABLE "journal" ALTER COLUMN "access" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user-community" ADD COLUMN "invite" text DEFAULT 'pending' NOT NULL;