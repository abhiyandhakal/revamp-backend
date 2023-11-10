CREATE TABLE IF NOT EXISTS "aspect" (
	"aspectId" serial PRIMARY KEY NOT NULL,
	"aspect" text NOT NULL,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal" (
	"goalId" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"priority" text NOT NULL,
	"relatedArea" text NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"deadline" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now(),
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "option" (
	"option" text PRIMARY KEY NOT NULL,
	"questionId" serial NOT NULL,
	CONSTRAINT "option_option_unique" UNIQUE("option")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"questionId" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tag" (
	"tagId" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"aspectId" integer,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestone" (
	"milestoneId" serial PRIMARY KEY NOT NULL,
	"milestoneName" text NOT NULL,
	"taskId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task" (
	"taskId" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"priority" text NOT NULL,
	"deadline" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now(),
	"goalId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo" (
	"todoId" serial PRIMARY KEY NOT NULL,
	"todoName" text NOT NULL,
	"isDone" text DEFAULT 'false' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"taskId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"userId" text PRIMARY KEY NOT NULL,
	CONSTRAINT "user_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aspect" ADD CONSTRAINT "aspect_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal" ADD CONSTRAINT "goal_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "option" ADD CONSTRAINT "option_questionId_question_questionId_fk" FOREIGN KEY ("questionId") REFERENCES "question"("questionId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tag" ADD CONSTRAINT "tag_aspectId_aspect_aspectId_fk" FOREIGN KEY ("aspectId") REFERENCES "aspect"("aspectId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tag" ADD CONSTRAINT "tag_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "milestone" ADD CONSTRAINT "milestone_taskId_task_taskId_fk" FOREIGN KEY ("taskId") REFERENCES "task"("taskId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_goalId_goal_goalId_fk" FOREIGN KEY ("goalId") REFERENCES "goal"("goalId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo" ADD CONSTRAINT "todo_taskId_task_taskId_fk" FOREIGN KEY ("taskId") REFERENCES "task"("taskId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
