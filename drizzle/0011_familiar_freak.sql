CREATE TABLE IF NOT EXISTS "goal-question-relation" (
	"goalQuestionId" integer NOT NULL,
	"answer" text NOT NULL,
	"goalId" integer NOT NULL
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
	"role" text NOT NULL
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
