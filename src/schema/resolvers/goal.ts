import { eq } from "drizzle-orm";
import db from "../../db";
import { goal } from "../../db/schema/goal";
import { Goal, MutationSetGoalArgs } from "../../generated/graphql";
import { getTasksOfGoal } from "./task";
import { goalQuestion } from "../../db/schema/goal-question";
import { goalQuestionRelation } from "../../db/schema/relations/goal-question";

export async function getGoals(userId: string): Promise<Goal[]> {
	const goals = await db.select().from(goal).where(eq(goal.userId, userId));

	const goalsWithTasks: Goal[] = await Promise.all(
		goals.map(async singleGoal => {
			const tasks = await getTasksOfGoal(singleGoal.goalId);

			const goalQuestions = await db
				.select()
				.from(goalQuestion)
				.innerJoin(
					goalQuestionRelation,
					eq(goalQuestionRelation.goalQuestionId, goalQuestion.goalQuestionId),
				)
				.where(eq(goalQuestionRelation.goalId, singleGoal.goalId));

			return {
				...singleGoal,
				goalId: singleGoal.goalId.toString(),
				tasks,
				goalQnas: goalQuestions.map(gq => ({
					goalQnaId: gq["goal-question"].goalQuestionId.toString(),
					question: gq["goal-question"].question,
					answer: gq["goal-question-relation"].answer,
				})),
			};
		}),
	);

	return goalsWithTasks;
}

export async function setGoal(input: MutationSetGoalArgs): Promise<string> {
	const newGoal = {
		...input,
	};

	await db.insert(goal).values(newGoal);

	return `Goal with title ${input.title} has been successfully created`;
}
