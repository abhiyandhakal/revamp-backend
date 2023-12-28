CREATE TABLE IF NOT EXISTS "aspect" (
	"aspectId" serial PRIMARY KEY NOT NULL,
	"aspect" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comment" (
	"commentId" serial PRIMARY KEY NOT NULL,
	"comment" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	"userId" text NOT NULL,
	"journalId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community" (
	"communityId" serial PRIMARY KEY NOT NULL,
	"community" text NOT NULL,
	"description" text NOT NULL,
	"nametag" text NOT NULL,
	"privacy" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-question" (
	"goalQuestionId" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal" (
	"goalId" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"priority" text DEFAULT 'medium',
	"relatedArea" text,
	"isDone" boolean DEFAULT false NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"access" text DEFAULT 'private' NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"deadline" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	"streakUpdatedAt" timestamp,
	"order" serial NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal" (
	"journalId" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" text NOT NULL,
	"access" text DEFAULT 'private' NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"isUpdated" text DEFAULT 'false',
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
	"question" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-question-relation" (
	"goalQuestionId" integer NOT NULL,
	"answer" text NOT NULL,
	"goalId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-shared" (
	"sharedId" serial PRIMARY KEY NOT NULL,
	"goalId" integer NOT NULL,
	"userId" text NOT NULL,
	"communityId" integer NOT NULL,
	"sharedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal-shared" (
	"sharedId" serial PRIMARY KEY NOT NULL,
	"journalId" integer NOT NULL,
	"userId" text NOT NULL,
	"communityId" integer NOT NULL,
	"sharedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task-timelapse" (
	"taskId" integer NOT NULL,
	"timelapseId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo-timelapse" (
	"todoId" integer NOT NULL,
	"timelapseId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user-aspect" (
	"userId" text NOT NULL,
	"aspectId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user-community" (
	"userId" text,
	"communityId" integer,
	"role" text NOT NULL,
	"invite" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user-likes-journal" (
	"likeId" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"journalId" integer NOT NULL,
	"likedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user-question" (
	"userId" text NOT NULL,
	"questionId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user-tag" (
	"userId" text NOT NULL,
	"tagId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tag" (
	"tagId" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"aspectId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestone" (
	"milestoneId" serial PRIMARY KEY NOT NULL,
	"milestone" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"taskId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task" (
	"taskId" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"priority" text DEFAULT 'medium',
	"isDone" boolean DEFAULT false NOT NULL,
	"deadline" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	"order" serial NOT NULL,
	"goalId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pause-time" (
	"pauseTimeId" serial PRIMARY KEY NOT NULL,
	"pauseTime" timestamp NOT NULL,
	"timeLapseId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume-time" (
	"resumeTimeId" serial PRIMARY KEY NOT NULL,
	"resumeTime" timestamp NOT NULL,
	"timeLapseId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timelapse" (
	"timelapseId" serial PRIMARY KEY NOT NULL,
	"startTime" timestamp NOT NULL,
	"endTime" timestamp,
	"duration" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo" (
	"todoId" serial PRIMARY KEY NOT NULL,
	"todo" text NOT NULL,
	"isDone" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	"order" serial NOT NULL,
	"taskId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"username" text NOT NULL,
	"imageUrl" text NOT NULL,
	"banned" boolean NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"timezone" text NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"streakUpdatedAt" timestamp,
	CONSTRAINT "account_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user-email" (
	"userId" text NOT NULL,
	"emailAddress" text PRIMARY KEY NOT NULL,
	"isPrimary" boolean NOT NULL,
	"verified" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "worked-on-log" (
	"date" timestamp DEFAULT now(),
	"userId" integer NOT NULL,
	"taskId" integer NOT NULL,
	"goalId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_journalId_journal_journalId_fk" FOREIGN KEY ("journalId") REFERENCES "journal"("journalId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal" ADD CONSTRAINT "goal_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal" ADD CONSTRAINT "journal_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "goal-question-relation" ADD CONSTRAINT "goal-question-relation_goalQuestionId_goal-question_goalQuestionId_fk" FOREIGN KEY ("goalQuestionId") REFERENCES "goal-question"("goalQuestionId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-question-relation" ADD CONSTRAINT "goal-question-relation_goalId_goal_goalId_fk" FOREIGN KEY ("goalId") REFERENCES "goal"("goalId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-shared" ADD CONSTRAINT "goal-shared_goalId_goal_goalId_fk" FOREIGN KEY ("goalId") REFERENCES "goal"("goalId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-shared" ADD CONSTRAINT "goal-shared_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-shared" ADD CONSTRAINT "goal-shared_communityId_community_communityId_fk" FOREIGN KEY ("communityId") REFERENCES "community"("communityId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal-shared" ADD CONSTRAINT "journal-shared_journalId_journal_journalId_fk" FOREIGN KEY ("journalId") REFERENCES "journal"("journalId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal-shared" ADD CONSTRAINT "journal-shared_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal-shared" ADD CONSTRAINT "journal-shared_communityId_community_communityId_fk" FOREIGN KEY ("communityId") REFERENCES "community"("communityId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task-timelapse" ADD CONSTRAINT "task-timelapse_taskId_task_taskId_fk" FOREIGN KEY ("taskId") REFERENCES "task"("taskId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task-timelapse" ADD CONSTRAINT "task-timelapse_timelapseId_timelapse_timelapseId_fk" FOREIGN KEY ("timelapseId") REFERENCES "timelapse"("timelapseId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-timelapse" ADD CONSTRAINT "todo-timelapse_todoId_todo_todoId_fk" FOREIGN KEY ("todoId") REFERENCES "todo"("todoId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo-timelapse" ADD CONSTRAINT "todo-timelapse_timelapseId_timelapse_timelapseId_fk" FOREIGN KEY ("timelapseId") REFERENCES "timelapse"("timelapseId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-aspect" ADD CONSTRAINT "user-aspect_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-aspect" ADD CONSTRAINT "user-aspect_aspectId_aspect_aspectId_fk" FOREIGN KEY ("aspectId") REFERENCES "aspect"("aspectId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-community" ADD CONSTRAINT "user-community_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-community" ADD CONSTRAINT "user-community_communityId_community_communityId_fk" FOREIGN KEY ("communityId") REFERENCES "community"("communityId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-likes-journal" ADD CONSTRAINT "user-likes-journal_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-likes-journal" ADD CONSTRAINT "user-likes-journal_journalId_journal_journalId_fk" FOREIGN KEY ("journalId") REFERENCES "journal"("journalId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-question" ADD CONSTRAINT "user-question_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-question" ADD CONSTRAINT "user-question_questionId_question_questionId_fk" FOREIGN KEY ("questionId") REFERENCES "question"("questionId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-tag" ADD CONSTRAINT "user-tag_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-tag" ADD CONSTRAINT "user-tag_tagId_tag_tagId_fk" FOREIGN KEY ("tagId") REFERENCES "tag"("tagId") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "pause-time" ADD CONSTRAINT "pause-time_timeLapseId_timelapse_timelapseId_fk" FOREIGN KEY ("timeLapseId") REFERENCES "timelapse"("timelapseId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume-time" ADD CONSTRAINT "resume-time_timeLapseId_timelapse_timelapseId_fk" FOREIGN KEY ("timeLapseId") REFERENCES "timelapse"("timelapseId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo" ADD CONSTRAINT "todo_taskId_task_taskId_fk" FOREIGN KEY ("taskId") REFERENCES "task"("taskId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-email" ADD CONSTRAINT "user-email_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "worked-on-log" ADD CONSTRAINT "worked-on-log_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "worked-on-log" ADD CONSTRAINT "worked-on-log_taskId_task_taskId_fk" FOREIGN KEY ("taskId") REFERENCES "task"("taskId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "worked-on-log" ADD CONSTRAINT "worked-on-log_goalId_goal_goalId_fk" FOREIGN KEY ("goalId") REFERENCES "goal"("goalId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
