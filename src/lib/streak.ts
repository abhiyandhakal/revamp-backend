import { eq, and } from "drizzle-orm";
import db from "../db";
import { goal } from "../db/schema/goal";
import { user } from "../db/schema/user";
import { checkIfToday } from "./check-date";

export const increaseGoalStreak = async (goalId: number) => {
	try {
		const goals = await db
			.select()
			.from(goal)
			.where(and(eq(goal.goalId, goalId), eq(goal.isActive, true)));

		const singleGoal = goals[0];
		if (!checkIfToday(singleGoal.streakUpdatedAt)) {
			const date = new Date();

			await db
				.update(goal)
				.set({
					streak: singleGoal.streak + 1,
					streakUpdatedAt: date,
				})
				.where(eq(goal.goalId, goalId));
		}

		await increaseUserStreak(singleGoal.userId);
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error in increasing goal streak of goalId " + goalId + ": ", error.message);
		}
	}
};

async function increaseUserStreak(userId: string) {
	const userStreaks = await db
		.select({ streak: user.streak, streakUpdatedAt: user.streakUpdatedAt })
		.from(user)
		.where(eq(user.userId, userId));

	const userStreak = userStreaks[0];
	const streakUpdatedAt = new Date(
		userStreak.streakUpdatedAt?.toLocaleDateString() || "",
	).getTime();
}
