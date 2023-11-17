import { eq } from "drizzle-orm";
import db from "../../db";
import { milestone, task } from "../../db/schema/task";
import { MutationSetTaskArgs, Task } from "../../generated/graphql";
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

			const timelapseId =
				timelapseArr.length > 0 ? timelapseArr[0]["task-timelapse"].timelapseId : null;
			const timelapsed = timelapseArr.length > 0 ? await getTimelapse(timelapseId || 0) : null;

			const milestones = await db
				.select()
				.from(milestone)
				.where(eq(milestone.taskId, singleTask.taskId));

			return {
				...singleTask,
				taskId: singleTask.taskId.toString(),
				priority: singleTask.priority || "",
				timelapsed: timelapsed || null,
				milestones: milestones.map(milestone => ({
					...milestone,
					milestoneId: milestone.milestoneId.toString(),
				})),
			};
		}),
	);

	return tasksWithTodos;
}

export async function setTask(input: MutationSetTaskArgs) {
	await db.insert(task).values({ ...input, goalId: +input.goalId });

	return `Task with title "${input.title}" has been successfully created`;
}
