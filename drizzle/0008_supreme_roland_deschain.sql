ALTER TABLE "todo" ALTER COLUMN "isDone" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "todo" ALTER COLUMN "isDone" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "community" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "goal" ADD COLUMN "isDone" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "goal" ADD COLUMN "updateAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "isDone" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "updateAt" timestamp with time zone;