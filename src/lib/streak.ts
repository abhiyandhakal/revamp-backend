import { eq } from "drizzle-orm";
import db from "../db";
import { goal } from "../db/schema/goal";

export const increaseGoalStreak = async (goalId: number) => {
	try {
		const goalStreaks = await db
			.select({ streak: goal.streak, streakUpdatedAt: goal.streakUpdatedAt })
			.from(goal)
			.where(eq(goal.goalId, goalId));
		const goalStreak = goalStreaks[0];
		const streakUpdatedAt = new Date(
			goalStreak.streakUpdatedAt?.toLocaleDateString() || "",
		).getTime();

		if (!goalStreak.streakUpdatedAt || streakUpdatedAt < Date.now()) {
			await db
				.update(goal)
				.set({
					streak: (goalStreak.streak || 0) + 1,
					streakUpdatedAt: new Date(),
				})
				.where(eq(goal.goalId, goalId));
		}
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error in increasing goal streak of goalId: " + goalId, error.message);
		}
	}
};
