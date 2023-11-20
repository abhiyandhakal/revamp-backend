ALTER TABLE "task" ALTER COLUMN "priority" SET DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "milestone" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now();