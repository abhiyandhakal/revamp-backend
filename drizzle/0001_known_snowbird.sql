CREATE TABLE IF NOT EXISTS "pauseTime" (
	"pauseTimeId" serial PRIMARY KEY NOT NULL,
	"pauseTime" timestamp NOT NULL,
	"timeLapseId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resumeTime" (
	"resumeTimeId" serial PRIMARY KEY NOT NULL,
	"resumeTime" timestamp NOT NULL,
	"timeLapseId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timeLapse" (
	"timelapseId" serial PRIMARY KEY NOT NULL,
	"startTime" timestamp NOT NULL,
	"endTime" timestamp,
	"duration" timestamp
);
--> statement-breakpoint
ALTER TABLE "milestone" RENAME COLUMN "milestoneName" TO "milestone";--> statement-breakpoint
ALTER TABLE "todo" RENAME COLUMN "todoName" TO "todo";--> statement-breakpoint
ALTER TABLE "aspect" DROP CONSTRAINT "aspect_userId_user_userId_fk";
--> statement-breakpoint
ALTER TABLE "question" DROP CONSTRAINT "question_userId_user_userId_fk";
--> statement-breakpoint
ALTER TABLE "tag" DROP CONSTRAINT "tag_userId_user_userId_fk";
--> statement-breakpoint
ALTER TABLE "goal" ALTER COLUMN "priority" SET DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "goal" ALTER COLUMN "priority" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tag" ALTER COLUMN "aspectId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "priority" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "goalId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ALTER COLUMN "taskId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "aspect" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "question" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "tag" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pauseTime" ADD CONSTRAINT "pauseTime_timeLapseId_timeLapse_timelapseId_fk" FOREIGN KEY ("timeLapseId") REFERENCES "timeLapse"("timelapseId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resumeTime" ADD CONSTRAINT "resumeTime_timeLapseId_timeLapse_timelapseId_fk" FOREIGN KEY ("timeLapseId") REFERENCES "timeLapse"("timelapseId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
