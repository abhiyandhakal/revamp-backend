import { text, pgTable, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { task } from "./task";

export const todo = pgTable("todo", {
	todoId: serial("todoId").primaryKey(),
	todoName: text("todoName").notNull(),
	isDone: text("isDone").notNull().default("false"),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	taskId: integer("taskId").references(() => task.taskId),
});
