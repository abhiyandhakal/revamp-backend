import { sql } from "drizzle-orm";
import db from "../../db";
import { task } from "../../db/schema/task";
import { goal } from "../../db/schema/goal";
import { QueryResolvers } from "../../generated/graphql";
import { getSession } from "../../middlewares/permissions";

export const tasksCompletedAnalyticsEachDayOfGoal: QueryResolvers["tasksCompletedAnalyticsEachDayOfGoal"] =
	async function(_, { goalId }) {
		const completedTasksCountFromDb = (await db.execute(
			sql`SELECT COUNT(*), DATE(${task.updatedAt}) as date FROM ${task} WHERE ${task.goalId} = ${goalId} AND ${task.isDone} = TRUE GROUP BY ${task.updatedAt}`,
		)) as { count: number; date: typeof task.$inferSelect.updatedAt }[];

		return completedTasksCountFromDb;
	};

export const tasksCompletedAnalyticsEachDayOfUser: QueryResolvers["tasksCompletedAnalyticsEachDayOfUser"] =
	async function(_, __, ctx) {
		const session = await getSession(ctx.request.headers);
		const completedTasksCountFromDb = await db.execute(
			sql`SELECT COUNT(*), DATE(${task.updatedAt}) as date FROM ${task} INNER JOIN ${goal} ON ${goal.goalId} = ${task.goalId} WHERE ${goal.userId} = ${session.userId} AND ${task.isDone} = TRUE GROUP BY DATE(${task.updatedAt})`,
		);

		console.log(completedTasksCountFromDb);

		throw new Error("Not implemented");
	};
