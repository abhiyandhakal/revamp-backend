import { eq } from "drizzle-orm";
import db from "../../db";
import { milestone, task } from "../../db/schema/task";
import { MutationSetTaskArgs, Task } from "../../generated/graphql";
import { taskTimelapse } from "../../db/schema/relations/task-timelapse";
import { getTimelapse } from "./timelapse";
import { goal } from "../../db/schema/goal";

export async function getSingleTask(taskId: string | number): Promise<Task> {
	const taskList = await db.select().from(task).where(eq(task.taskId, +taskId));
	const singleTask = taskList[0];

	if (!singleTask) throw new Error("Task not found");

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
}

export async function getTaskInGqlFormat(singleTask: typeof task.$inferSelect): Promise<Task> {
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
}

export async function getTasksOfGoal(goalId: string | number): Promise<Task[]> {
	const tasks = await db.select().from(task).where(eq(task.goalId, +goalId));
	const tasksWithTodos: Task[] = await Promise.all(
		tasks.map(async singleTask => getTaskInGqlFormat(singleTask)),
	);

	return tasksWithTodos;
}

export async function getTasksOfUser(userId: string): Promise<Task[]> {
	const tasks = await db
		.select()
		.from(task)
		.innerJoin(goal, eq(goal.goalId, task.goalId))
		.where(eq(goal.userId, userId));
	const tasksWithTodos: Task[] = await Promise.all(
		tasks.map(async singleTask => getTaskInGqlFormat(singleTask.task)),
	);

	return tasksWithTodos;
}

export async function setTask(input: MutationSetTaskArgs) {
	await db.insert(task).values({ ...input, goalId: +input.goalId });

	return `Task with title "${input.title}" has been successfully created`;
}
