import { text, pgTable, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { task } from "./task";

export const todo = pgTable("todo", {
	todoId: serial("todoId").primaryKey(),
	todo: text("todo").notNull(),
	isDone: boolean("isDone").notNull().default(false),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	updateAt: timestamp("updateAt", { withTimezone: true }),
	order: serial("order"),
	taskId: integer("taskId")
		.references(() => task.taskId)
		.notNull(),
});
