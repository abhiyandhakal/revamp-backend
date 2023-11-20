import { eq } from "drizzle-orm";
import db from "../../db";
import { option, question } from "../../db/schema/question";
import { Question } from "../../generated/graphql";

export const getAllQuestions = async (): Promise<Question[]> => {
	const questions = await db.select().from(question);
	const questionsWithOptions: Question[] = await Promise.all(
		questions.map(async question => {
			const options = await db
				.select()
				.from(option)
				.where(eq(option.questionId, question.questionId));

			return {
				...question,
				questionId: question.questionId.toString(),
				options: options.map(option => option.option),
			};
		}),
	);

	return questionsWithOptions;
};
