ALTER TABLE "user" RENAME TO "account";--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "user_userId_unique";--> statement-breakpoint
ALTER TABLE "comment" DROP CONSTRAINT "comment_userId_user_userId_fk";
--> statement-breakpoint
ALTER TABLE "goal" DROP CONSTRAINT "goal_userId_user_userId_fk";
--> statement-breakpoint
ALTER TABLE "journal" DROP CONSTRAINT "journal_userId_user_userId_fk";
--> statement-breakpoint
ALTER TABLE "user-email" DROP CONSTRAINT "user-email_userId_user_userId_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "user-email" ADD CONSTRAINT "user-email_userId_account_userId_fk" FOREIGN KEY ("userId") REFERENCES "account"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_unique" UNIQUE("userId");