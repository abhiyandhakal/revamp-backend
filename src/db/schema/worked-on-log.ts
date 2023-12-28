import { pgTable, integer, timestamp } from "drizzle-orm/pg-core";
import { goal } from "./goal";
import { task } from "./task";

export const workedOnLog = pgTable("worked-on-log", {
	date: timestamp("date").defaultNow().notNull(),
	taskId: integer("taskId")
		.notNull()
		.references(() => task.taskId),
	goalId: integer("goalId")
		.notNull()
		.references(() => goal.goalId),
});
