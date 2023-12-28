import { pgTable, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { goal } from "./goal";
import { task } from "./task";

export const workedOnLog = pgTable("worked-on-log", {
	date: timestamp("date").defaultNow(),
	userId: integer("userId")
		.notNull()
		.references(() => user.userId),
	taskId: integer("taskId")
		.notNull()
		.references(() => task.taskId),
	goalId: integer("goalId")
		.notNull()
		.references(() => goal.goalId),
});
