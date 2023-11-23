ALTER TABLE "goal" RENAME COLUMN "status" TO "isActive";--> statement-breakpoint
ALTER TABLE "goal" ALTER COLUMN "isActive" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "goal" ALTER COLUMN "isActive" SET DEFAULT true;