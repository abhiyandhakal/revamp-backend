import { sql } from "drizzle-orm";
import db from "../../db";
import { task } from "../../db/schema/task";
import { goal } from "../../db/schema/goal";
import { QueryResolvers } from "../../generated/graphql";
import { getSession } from "../../middlewares/permissions";
import { workedOnLog } from "../../db/schema/worked-on-log";

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
		const completedTasksCountFromDb = (await db.execute(
			sql`SELECT COUNT(*), DATE(${task.updatedAt}) as date FROM ${task} INNER JOIN ${goal} ON ${goal.goalId} = ${task.goalId} WHERE ${goal.userId} = ${session.userId} AND ${task.isDone} = TRUE GROUP BY DATE(${task.updatedAt})`,
		)) as { count: number; date: typeof task.$inferSelect.updatedAt }[];

		return completedTasksCountFromDb;
	};

export const tasksWorkedOnAnalyticsEachDayOfGoal: QueryResolvers["tasksWorkedOnAnalyticsEachDayOfGoal"] =
	async function(_, { goalId }) {
		const workedOnTasksCountFromDb = (await db.execute(
			sql`SELECT COUNT(*), DATE(${workedOnLog.date}) FROM ${workedOnLog} WHERE ${workedOnLog.goalId} = ${goalId} GROUP BY DATE(${workedOnLog.date})`,
		)) as { count: number; date: typeof workedOnLog.$inferSelect.date }[];

		return workedOnTasksCountFromDb;
	};

export const tasksWorkedOnAnalyticsEachDayOfUser: QueryResolvers["tasksWorkedOnAnalyticsEachDayOfUser"] =
	async function(_, __, ctx) {
		const session = await getSession(ctx.request.headers);
		const workedOnTasksCountFromDb = (await db.execute(
			sql`SELECT COUNT(*), DATE(${workedOnLog.date}) FROM ${workedOnLog} INNER JOIN ${goal} ON ${goal.goalId} = ${workedOnLog.goalId} WHERE ${goal.userId} = ${session.userId} GROUP BY DATE(${workedOnLog.date})`,
		)) as { count: number; date: typeof workedOnLog.$inferSelect.date }[];

		return workedOnTasksCountFromDb;
	};
