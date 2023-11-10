import { pgTable, integer } from "drizzle-orm/pg-core";
import { task } from "../task";
import { timeLapse } from "../time-lapse";

export const taskTimelapse = pgTable("task-timelapse", {
	taskId: integer("taskId")
		.references(() => task.taskId)
		.notNull(),
	timelapseId: integer("timelapseId")
		.references(() => timeLapse.timelapseId)
		.notNull(),
});
