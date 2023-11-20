import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { goalQuestion } from "../goal-question";
import { goal } from "../goal";

export const goalQuestionRelation = pgTable("goal-question-relation", {
	goalQuestionId: integer("goalQuestionId")
		.references(() => goalQuestion.goalQuestionId)
		.notNull(),
	answer: text("answer").notNull(),
	goalId: integer("goalId")
		.references(() => goal.goalId)
		.notNull(),
});
