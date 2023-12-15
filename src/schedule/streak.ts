import { eq } from "drizzle-orm";
import db from "../db";
import { goal } from "../db/schema/goal";
import { user } from "../db/schema/user";

export const goalStreakSchedule = async () => {
	// get all goals
	const goals = await db
		.select({ goalId: goal.goalId, streakUpdatedAt: goal.streakUpdatedAt })
		.from(goal);

	// check if streakUpdatedAt is today
	goals.forEach(singleGoal => {
		if (singleGoal.streakUpdatedAt) {
			if (new Date(singleGoal.streakUpdatedAt?.toLocaleDateString()) < new Date()) {
				// reset streak
				db.update(goal).set({ streak: 0 }).where(eq(goal.goalId, singleGoal.goalId));
			}
		}
	});
};

export const userStreakSchedule = async () => {
	// get all users
	const users = await db
		.select({ userId: user.userId, streak: user.streak, streakUpdatedAt: user.streakUpdatedAt })
		.from(user);

	// check if streakUpdatedAt is today
};
