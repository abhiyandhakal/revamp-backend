CREATE TABLE IF NOT EXISTS "goal-shared" (
	"sharedId" serial PRIMARY KEY NOT NULL,
	"goalId" integer NOT NULL,
	"userId" text NOT NULL,
	"communityId" integer NOT NULL,
	"sharedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "goal" ADD COLUMN "access" text DEFAULT 'private' NOT NULL;--> statement-breakpoint
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
