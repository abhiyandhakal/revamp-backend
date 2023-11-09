import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { user } from "./user";

export const question = pgTable("question", {
	questionId: serial("questionId").primaryKey(),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
	userId: text("userId").references(() => user.userId),
});

export const option = pgTable("option", {
	option: text("option").notNull().unique().primaryKey(),
	questionId: serial("questionId").references(() => question.questionId),
});
