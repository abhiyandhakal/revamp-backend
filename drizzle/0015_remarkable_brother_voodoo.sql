ALTER TABLE "journal" ALTER COLUMN "access" SET DEFAULT 'private';--> statement-breakpoint
ALTER TABLE "journal" ALTER COLUMN "access" DROP NOT NULL;