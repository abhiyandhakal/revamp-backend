ALTER TABLE "pauseTime" RENAME TO "pause-time";--> statement-breakpoint
ALTER TABLE "resumeTime" RENAME TO "resume-time";--> statement-breakpoint
ALTER TABLE "timeLapse" RENAME TO "timelapse";--> statement-breakpoint
ALTER TABLE "pause-time" DROP CONSTRAINT "pauseTime_timeLapseId_timeLapse_timelapseId_fk";
--> statement-breakpoint
ALTER TABLE "resume-time" DROP CONSTRAINT "resumeTime_timeLapseId_timeLapse_timelapseId_fk";
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
