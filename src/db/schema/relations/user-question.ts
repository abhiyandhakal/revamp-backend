import { pgTable, text, integer } from "drizzle-orm/pg-core";

import { user } from "../user";
import { question } from "../question";

export const userQuestion = pgTable("user-question", {
	userId: text("userId")
		.references(() => user.userId)
		.notNull(),
	questionId: integer("questionId")
		.references(() => question.questionId)
		.notNull(),
});
