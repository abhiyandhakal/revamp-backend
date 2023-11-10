import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const timeLapse = pgTable("timelapse", {
	timelapseId: serial("timelapseId").primaryKey(),
	startTime: timestamp("startTime").notNull(),
	endTime: timestamp("endTime"),
	duration: timestamp("duration"),
});

export const pauseTime = pgTable("pause-time", {
	pauseTimeId: serial("pauseTimeId").primaryKey(),
	pauseTime: timestamp("pauseTime").notNull(),
	timeLapseId: integer("timeLapseId")
		.references(() => timeLapse.timelapseId)
		.notNull(),
});

export const resumeTime = pgTable("resume-time", {
	resumeTimeId: serial("resumeTimeId").primaryKey(),
	resumeTime: timestamp("resumeTime").notNull(),
	timeLapseId: integer("timeLapseId")
		.references(() => timeLapse.timelapseId)
		.notNull(),
});
