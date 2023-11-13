import { eq } from "drizzle-orm";
import db from "../../db";
import { milestone, task } from "../../db/schema/task";
import { Task } from "../../generated/graphql";
import { taskTimelapse } from "../../db/schema/relations/task-timelapse";
import { getTimelapse } from "./timelapse";

export async function getTasks(goalId: string | number): Promise<Task[]> {
	const tasks = await db.select().from(task).where(eq(task.goalId, +goalId));
	const tasksWithTodos: Task[] = await Promise.all(
		tasks.map(async singleTask => {
			const timelapseArr = await db
				.select()
				.from(taskTimelapse)
				.innerJoin(task, eq(task.taskId, taskTimelapse.taskId))
				.where(eq(task.taskId, singleTask.taskId));

			const timelapseId = timelapseArr[0]["task-timelapse"].timelapseId;
			const timelapsed = await getTimelapse(timelapseId);

			const milestones = await db
				.select()
				.from(milestone)
				.where(eq(milestone.taskId, singleTask.taskId));

			return {
				...singleTask,
				taskId: singleTask.taskId.toString(),
				updatedAt: singleTask.updateAt,
				timelapsed,
				milestones: milestones.map(milestone => ({
					...milestone,
					milestoneId: milestone.milestoneId.toString(),
				})),
			};
		}),
	);

	return tasksWithTodos;
}
