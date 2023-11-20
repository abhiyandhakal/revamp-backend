import { text, pgTable, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { goal } from "./goal";

export const task = pgTable("task", {
	taskId: serial("taskId").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	priority: text("priority").default("medium"),
	isDone: boolean("isDone").notNull().default(false),
	deadline: timestamp("deadline", { withTimezone: true }),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	updateAt: timestamp("updateAt", { withTimezone: true }),
	order: serial("order"),
	streak: integer("streak").notNull().default(0),
	goalId: integer("goalId")
		.references(() => goal.goalId)
		.notNull(),
});

export const milestone = pgTable("milestone", {
	milestoneId: serial("milestoneId").primaryKey(),
	milestone: text("milestone").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	taskId: integer("taskId")
		.notNull()
		.references(() => task.taskId)
		.notNull(),
});
