CREATE TABLE IF NOT EXISTS "user-likes-goal" (
	"likeId" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"goalId" integer NOT NULL,
	"likedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-likes-goal" ADD CONSTRAINT "user-likes-goal_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-likes-goal" ADD CONSTRAINT "user-likes-goal_goalId_goal_goalId_fk" FOREIGN KEY ("goalId") REFERENCES "goal"("goalId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
