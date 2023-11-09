import { text, pgTable, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { goal } from "./goal";

export const task = pgTable("task", {
	taskId: serial("taskId").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	priority: text("priority").notNull(),
	deadline: timestamp("deadline", { withTimezone: true }),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	goalId: integer("goalId").references(() => goal.goalId),
});

export const milestone = pgTable("milestone", {
	milestoneId: serial("milestoneId").primaryKey(),
	milestoneName: text("milestoneName").notNull(),
	taskId: integer("taskId")
		.notNull()
		.references(() => task.taskId),
});
