import { eq } from "drizzle-orm";
import db from "../../db";
import { goal } from "../../db/schema/goal";
import { Goal, MutationResolvers, QueryResolvers } from "../../generated/graphql";
import { deleteTaskFunc, getTasksOfGoalFunc } from "./task";
import { goalQuestion } from "../../db/schema/goal-question";
import { goalQuestionRelation } from "../../db/schema/relations/goal-question";
import { task } from "../../db/schema/task";
import { goalShared } from "../../db/schema/relations/goal-share";
import { getSession } from "../../middlewares/permissions";
import { community } from "../../db/schema/community";

export const getSingleGoal: QueryResolvers["getSingleGoal"] = async function (_, { goalId }) {
	const goals = await db.select().from(goal).where(eq(goal.goalId, goalId));
	const singleGoal = goals[0];

	if (!singleGoal) throw new Error("Goal not found");

	const singleGoalSql = await sqlToGqlGoal(singleGoal);
	return singleGoalSql;
};

export async function sqlToGqlGoal(singleGoal: typeof goal.$inferSelect): Promise<Goal> {
	if (!singleGoal) throw new Error("Goal not found");

	const tasks = await getTasksOfGoalFunc(singleGoal.goalId);

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
		tasks,
		goalQnas: goalQuestions.map(gq => ({
			goalQnaId: gq["goal-question"].goalQuestionId,
			question: gq["goal-question"].question,
			answer: gq["goal-question-relation"].answer,
		})),
	};
}

export const getGoalsFunc = async function (userId: string): Promise<Goal[]> {
	const goals = await db.select().from(goal).where(eq(goal.userId, userId));

	const goalsWithTasks: Goal[] = await Promise.all(
		goals.map(async singleGoal => await sqlToGqlGoal(singleGoal)),
	);

	return goalsWithTasks;
};
export const getGoals: QueryResolvers["getGoals"] = (_, { userId }) => getGoalsFunc(userId);

export const setGoal: MutationResolvers["setGoal"] = async function (_, input) {
	const newGoal = {
		...input,
	};

	await db.insert(goal).values(newGoal);

	return `Goal with title ${input.title} has been successfully created`;
};

export const deleteGoal: MutationResolvers["deleteGoal"] = async function (_, { goalId }) {
	// get goal
	const goalArr = await db.select().from(goal).where(eq(goal.goalId, goalId));

	if (goalArr.length === 0) throw new Error("Goal not found");

	// get tasks
	const tasks = await db.select().from(task).where(eq(task.goalId, goalId));

	// delete tasks
	await Promise.all(tasks.map(async singleTask => deleteTaskFunc(singleTask.taskId)));

	// delete goal
	await db.delete(goal).where(eq(goal.goalId, goalId));

	return `Goal with id ${goalId} has been successfully deleted`;
};

export const editGoal: MutationResolvers["editGoal"] = async function (_, args) {
	const goalArr = await db.select().from(goal).where(eq(goal.goalId, args.goalId));
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
			isDone: args.isDone != undefined ? args.isDone : singleGoal.isDone,
			isActive: args.isActive != undefined ? args.isActive : singleGoal.isActive,
			updatedAt: new Date(),
		})
		.where(eq(goal.goalId, args.goalId));

	return "Goal edited successfully";
};

export const shareGoal: MutationResolvers["shareGoal"] = async function (_, args, ctx) {
	const { goalId, communityId } = args;
	const session = await getSession(ctx.request.headers);

	await db.insert(goalShared).values({
		goalId,
		communityId,
		userId: session.userId,
	});

	return "Goal shared successfully in community with id " + communityId;
};

export const publishGoal: MutationResolvers["publishGoal"] = async function (_, { goalId }) {
	await db
		.update(goal)
		.set({
			access: "public",
		})
		.where(eq(goal.goalId, goalId));

	return "Goal published successfully";
};
