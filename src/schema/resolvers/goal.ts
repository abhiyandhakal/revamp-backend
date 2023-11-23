import { eq } from "drizzle-orm";
import db from "../../db";
import { goal } from "../../db/schema/goal";
import { Goal, MutationEditGoalArgs, MutationSetGoalArgs } from "../../generated/graphql";
import { deleteTask, getTasksOfGoal } from "./task";
import { goalQuestion } from "../../db/schema/goal-question";
import { goalQuestionRelation } from "../../db/schema/relations/goal-question";
import { task } from "../../db/schema/task";

export async function getSingleGoal(goalId: string | number): Promise<Goal> {
	const goals = await db.select().from(goal).where(eq(goal.goalId, +goalId));
	const singleGoal = goals[0];

	if (!singleGoal) throw new Error("Goal not found");

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
}

export async function sqlToGqlGoal(singleGoal: typeof goal.$inferSelect): Promise<Goal> {
	if (!singleGoal) throw new Error("Goal not found");

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
}

export async function getGoals(userId: string): Promise<Goal[]> {
	const goals = await db.select().from(goal).where(eq(goal.userId, userId));

	const goalsWithTasks: Goal[] = await Promise.all(
		goals.map(async singleGoal => await sqlToGqlGoal(singleGoal)),
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

export async function deleteGoal(goalId: string | number) {
	// get goal
	const goalArr = await db.select().from(goal).where(eq(goal.goalId, +goalId));

	if (goalArr.length === 0) throw new Error("Goal not found");

	// get tasks
	const tasks = await db.select().from(task).where(eq(task.goalId, +goalId));

	// delete tasks
	await Promise.all(tasks.map(async singleTask => deleteTask(singleTask.taskId)));

	// delete goal
	await db.delete(goal).where(eq(goal.goalId, +goalId));

	return `Goal with id ${goalId} has been successfully deleted`;
}

export async function editGoal(args: MutationEditGoalArgs): Promise<string> {
	const goalArr = await db.select().from(goal).where(eq(goal.goalId, +args.goalId));
	const singleGoal = goalArr[0];
	if (!singleGoal) throw new Error("No such goal found");

	await db
		.update(goal)
		.set({
			deadline: args.deadline || singleGoal.deadline,
			description: args.description || singleGoal.description,
			order: args.order || singleGoal.order,
			priority: args.priority || singleGoal.priority,
			relatedArea: args.relatedArea || singleGoal.relatedArea,
			title: args.title || singleGoal.title,
			isDone: args.isDone || singleGoal.isDone,
			isActive: args.isActive || singleGoal.isActive,
			updateAt: new Date(),
		})
		.where(eq(goal.goalId, +args.goalId));

	return "Goal edited successfully";
}
