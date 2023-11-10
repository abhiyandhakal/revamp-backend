import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const question = pgTable("question", {
	questionId: serial("questionId").primaryKey(),
	question: text("question").notNull(),
});

export const option = pgTable("option", {
	option: text("option").notNull().unique().primaryKey(),
	questionId: serial("questionId")
		.references(() => question.questionId)
		.notNull(),
});
