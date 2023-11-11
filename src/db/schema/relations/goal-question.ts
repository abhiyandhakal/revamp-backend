import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { goalQuestion } from "../goal-question";
import { question } from "../question";

export const goalQuestionRelation = pgTable("goal-question-relation", {
	goalQuestionId: integer("goalQuestionId")
		.references(() => goalQuestion.goalQuestionId)
		.notNull(),
	answer: text("answer").notNull(),
	questionId: integer("questionId")
		.references(() => question.questionId)
		.notNull(),
});
