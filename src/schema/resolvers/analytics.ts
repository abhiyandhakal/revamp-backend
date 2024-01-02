import { sql } from "drizzle-orm";
import db from "../../db";
import { task } from "../../db/schema/task";
import { QueryResolvers } from "../../generated/graphql";

export const tasksCompletedAnalyticsEachDayOfGoal: QueryResolvers["tasksCompletedAnalyticsEachDayOfGoal"] =
	async function(_, { goalId }) {
		const completedTasksCountFromDb = (await db.execute(
			sql`SELECT COUNT(*), DATE(${task.updatedAt}) as date FROM ${task} WHERE ${task.goalId} = ${goalId} AND ${task.isDone} = TRUE GROUP BY ${task.updatedAt}`,
		)) as { count: number; date: typeof task.$inferSelect.updatedAt }[];

		return completedTasksCountFromDb;
	};
