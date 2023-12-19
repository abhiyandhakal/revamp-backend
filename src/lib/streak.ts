import { eq, and } from "drizzle-orm";
import db from "../db";
import { goal } from "../db/schema/goal";
import { user } from "../db/schema/user";
import { checkIfToday } from "./check-date";

export const increaseGoalStreak = async (goalId: number) => {
	try {
		const goals = await db
			.select({
				streak: goal.streak,
				streakUpdatedAt: goal.streakUpdatedAt,
				userId: goal.userId,
				goalId: goal.goalId,
				isActive: goal.isActive,
			})
			.from(goal)
			.where(and(eq(goal.goalId, goalId), eq(goal.isActive, true)));

		const singleGoal = goals[0];
		console.log(singleGoal);

		if (!checkIfToday(singleGoal.streakUpdatedAt) && singleGoal.isActive) {
			const date = new Date();

			await db
				.update(goal)
				.set({
					streak: singleGoal.streak + 1,
					streakUpdatedAt: date,
				})
				.where(eq(goal.goalId, goalId));
		}

		await increaseUserStreak(singleGoal.userId, singleGoal.goalId);
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error in increasing goal streak of goalId " + goalId + ": ", error.message);
		}
	}
};

async function increaseUserStreak(userId: string, goalId: number) {
	const userWithGoalArr = await db
		.select()
		.from(user)
		.innerJoin(goal, and(eq(goal.userId, user.userId), eq(goal.goalId, goalId)))
		.where(eq(user.userId, userId));
	const singleUser = userWithGoalArr[0];

	if (!checkIfToday(singleUser.account.streakUpdatedAt)) {
		const date = new Date();

		await db
			.update(user)
			.set({
				streak: singleUser.account.streak + 1,
				streakUpdatedAt: date,
			})
			.where(eq(user.userId, userId));
	}
}
