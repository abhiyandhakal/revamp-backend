import { and, eq } from "drizzle-orm";
import db from "../../db";
import { goal } from "../../db/schema/goal";
import { user } from "../../db/schema/user";
import { Goal, MutationResolvers, QueryResolvers } from "../../generated/graphql";
import { deleteTaskFunc, getTasksOfGoalFunc } from "./task";
import { goalQuestion } from "../../db/schema/goal-question";
import { goalQuestionRelation } from "../../db/schema/relations/goal-question";
import { task } from "../../db/schema/task";
import { goalShared } from "../../db/schema/relations/goal-share";
import { getSession } from "../../middlewares/permissions";
import { userCommunity } from "../../db/schema/relations/user-community";
import { community } from "../../db/schema/community";

export const getSingleGoal: QueryResolvers["getSingleGoal"] = async function(_, { goalId }) {
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

	const goalCreatorArr = await db.select().from(user).where(eq(user.userId, singleGoal.userId));
	if (goalCreatorArr.length === 0) throw new Error("Goal creator not found");

	const sharers = await db
		.select()
		.from(goalShared)
		.innerJoin(user, eq(user.userId, goalShared.userId))
		.where(eq(goalShared.goalId, singleGoal.goalId));

	const sharedBy = await Promise.all(
		sharers.map(async sharer => {
			const communityArr = await db
				.select()
				.from(community)
				.where(eq(community.communityId, sharer["goal-shared"].communityId));

			return {
				sharedBy: { ...sharer.account, id: sharer.account.userId },
				sharedAt: sharer["goal-shared"].sharedAt,
				sharedIn: communityArr[0],
			};
		}),
	);

	return {
		...singleGoal,
		tasks,
		goalQnas: goalQuestions.map(gq => ({
			goalQnaId: gq["goal-question"].goalQuestionId,
			question: gq["goal-question"].question,
			answer: gq["goal-question-relation"].answer,
		})),
		createdBy: { ...goalCreatorArr[0], id: goalCreatorArr[0].userId },
		sharedBy,
	};
}

export const getGoalsFunc = async function(userId: string): Promise<Goal[]> {
	const goals = await db.select().from(goal).where(eq(goal.userId, userId));

	const goalsWithTasks: Goal[] = await Promise.all(
		goals.map(async singleGoal => await sqlToGqlGoal(singleGoal)),
	);

	return goalsWithTasks;
};
export const getGoals: QueryResolvers["getGoals"] = (_, { userId }) => getGoalsFunc(userId);

export const setGoal: MutationResolvers["setGoal"] = async function(_, input) {
	const newGoal = {
		...input,
	};

	await db.insert(goal).values(newGoal);

	return `Goal with title ${input.title} has been successfully created`;
};

export const deleteGoal: MutationResolvers["deleteGoal"] = async function(_, { goalId }) {
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

export const editGoal: MutationResolvers["editGoal"] = async function(_, args) {
	const goalArr = await db.select().from(goal).where(eq(goal.goalId, args.goalId));
	const singleGoal = goalArr[0];
	if (!singleGoal) throw new Error("No such goal found");

	console.log(args?.isActive);

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

export const shareGoal: MutationResolvers["shareGoal"] = async function(_, args, ctx) {
	const { goalId, communityId } = args;
	const session = await getSession(ctx.request.headers);

	// check if user is in the community
	const userInCommunity = await db
		.select()
		.from(userCommunity)
		.where(
			and(eq(userCommunity.communityId, communityId), eq(userCommunity.userId, session.userId)),
		);

	if (userInCommunity.length === 0) throw new Error("User not in community");

	if (userInCommunity[0].status !== "accepted") {
		throw new Error("User is not yet accepted in community");
	}

	await db.insert(goalShared).values({
		goalId,
		communityId,
		userId: session.userId,
	});

	return "Goal shared successfully in community with id " + communityId;
};

export const publishGoal: MutationResolvers["publishGoal"] = async function(_, { goalId }, ctx) {
	const session = await getSession(ctx.request.headers);

	await db
		.update(goal)
		.set({
			access: "public",
		})
		.where(and(eq(goal.goalId, goalId), eq(goal.userId, session.userId)));

	return "Goal published successfully";
};
