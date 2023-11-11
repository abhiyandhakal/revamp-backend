CREATE TABLE IF NOT EXISTS "user-email" (
	"userId" text NOT NULL,
	"emailAddress" text NOT NULL,
	"isPrimary" boolean NOT NULL,
	"verified" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "firstName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "lastName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "imageUrl" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "createdAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updatedAt" timestamp NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user-email" ADD CONSTRAINT "user-email_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
