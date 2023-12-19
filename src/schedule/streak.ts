import { eq } from "drizzle-orm";
import db from "../db";
import { goal } from "../db/schema/goal";
import { user } from "../db/schema/user";
import { task } from "../db/schema/task";
import { checkIfOlderThanToday, checkIfToday } from "../lib/check-date";

export const goalStreakSchedule = async () => {
	// get all goals
	const goals = await db
		.select({ goalId: goal.goalId, streakUpdatedAt: goal.streakUpdatedAt })
		.from(goal)
		.where(eq(goal.isActive, true));

	const tasks = await db.select().from(task);

	// check if streakUpdatedAt is today
	goals.forEach(singleGoal => {
		if (singleGoal.streakUpdatedAt) {
			if (new Date(singleGoal.streakUpdatedAt?.toLocaleDateString()) < new Date()) {
				// reset streak
				db.update(goal).set({ streak: 0 }).where(eq(goal.goalId, singleGoal.goalId));
			}
		}

		if (!checkIfToday(singleGoal.streakUpdatedAt)) {
			// reset streak
			db.update(goal).set({ streak: 0 }).where(eq(goal.goalId, singleGoal.goalId));
		}
	});

	await Promise.all(
		tasks.map(async singleTask => {
			if (checkIfOlderThanToday(singleTask.deadline)) {
				await db.update(goal).set({ streak: 0 }).where(eq(goal.goalId, singleTask.goalId));
			}
		}),
	);
};

export const userStreakSchedule = async () => {
	// get all users
	const users = await db
		.select({ userId: user.userId, streak: user.streak, streakUpdatedAt: user.streakUpdatedAt })
		.from(user);

	// check if streakUpdatedAt is today
	users.forEach(singleUser => {
		if (!checkIfToday(singleUser.streakUpdatedAt)) {
			db.update(user).set({ streak: 0 }).where(eq(user.userId, singleUser.userId));
		}
	});
};
