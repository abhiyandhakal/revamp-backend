import { eq } from "drizzle-orm";
import db from "../db";
import { goal } from "../db/schema/goal";
import { user } from "../db/schema/user";

export const increaseGoalStreak = async (goalId: number) => {
	try {
		const goalStreaks = await db
			.select({ streak: goal.streak, streakUpdatedAt: goal.streakUpdatedAt, userId: goal.userId })
			.from(goal)
			.where(eq(goal.goalId, goalId));
		const goalStreak = goalStreaks[0];
		const streakUpdatedAt =
			goalStreak.streakUpdatedAt && new Date(goalStreak.streakUpdatedAt.toLocaleDateString());
		if (!goalStreak.streakUpdatedAt || (streakUpdatedAt ? streakUpdatedAt < new Date() : true)) {
			await db
				.update(goal)
				.set({
					streak: (goalStreak.streak || 0) + 1,
					streakUpdatedAt: new Date(),
				})
				.where(eq(goal.goalId, goalId));
		}

		await increaseUserStreak(goalStreak.userId);
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error in increasing goal streak of goalId: " + goalId, error.message);
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
