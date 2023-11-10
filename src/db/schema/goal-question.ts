import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const goalQuestion = pgTable("goal-question", {
	goalQuestionId: serial("goalQuestionId").primaryKey(),
	question: text("question").notNull(),
});
