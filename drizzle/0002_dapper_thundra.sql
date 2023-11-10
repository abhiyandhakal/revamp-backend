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
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal" (
	"journalId" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" text NOT NULL,
	"access" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "goal" ALTER COLUMN "relatedArea" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "goal" ADD COLUMN "order" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "order" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "order" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "question" DROP COLUMN IF EXISTS "answer";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "journal" ADD CONSTRAINT "journal_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
