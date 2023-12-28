ALTER TABLE "worked-on-log" DROP CONSTRAINT "worked-on-log_userId_account_userId_fk";
--> statement-breakpoint
ALTER TABLE "worked-on-log" DROP COLUMN IF EXISTS "userId";