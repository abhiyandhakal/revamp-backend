import { pgTable, integer } from "drizzle-orm/pg-core";
import { todo } from "../todo";
import { timeLapse } from "../time-lapse";

export const todoTimelapse = pgTable("todo-timelapse", {
	todoId: integer("todoId")
		.references(() => todo.todoId)
		.notNull(),
	timelapseId: integer("timelapseId")
		.references(() => timeLapse.timelapseId)
		.notNull(),
});
