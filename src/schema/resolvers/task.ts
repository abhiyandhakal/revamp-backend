import { eq } from "drizzle-orm";
import db from "../../db";
import { milestone, task } from "../../db/schema/task";
import { MutationEditTaskArgs, MutationSetTaskArgs, Task } from "../../generated/graphql";
import { taskTimelapse } from "../../db/schema/relations/task-timelapse";
import { deleteTimelapseOfTask, getTimelapse } from "./timelapse";
import { goal } from "../../db/schema/goal";
import { deleteTodo, sqlToGqlTodo } from "./todo";
import { todo } from "../../db/schema/todo";

export async function getSingleTask(taskId: string | number): Promise<Task> {
	const taskList = await db.select().from(task).where(eq(task.taskId, +taskId));
	const singleTask = taskList[0];

	if (!singleTask) throw new Error("Task not found");

	const result = await sqlToGqlTask(singleTask);

	return result;
}

export async function sqlToGqlTask(singleTask: typeof task.$inferSelect): Promise<Task> {
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

	const todos = await db.select().from(todo).where(eq(todo.taskId, singleTask.taskId));

	const finalTodos = await Promise.all(
		todos.map(async singleTodo => await sqlToGqlTodo(singleTodo)),
	);

	return {
		...singleTask,
		taskId: singleTask.taskId.toString(),
		priority: singleTask.priority || "",
		timelapsed: timelapsed || null,
		todos: finalTodos,
		milestones: milestones.map(milestone => ({
			...milestone,
			milestoneId: milestone.milestoneId.toString(),
		})),
	};
}

export async function getTasksOfGoal(goalId: string | number): Promise<Task[]> {
	const tasks = await db.select().from(task).where(eq(task.goalId, +goalId));
	const tasksWithTodos: Task[] = await Promise.all(
		tasks.map(async singleTask => sqlToGqlTask(singleTask)),
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
		tasks.map(async singleTask => await sqlToGqlTask(singleTask.task)),
	);

	return tasksWithTodos;
}

export async function setTask(input: MutationSetTaskArgs) {
	await db.insert(task).values({ ...input, goalId: +input.goalId });

	return `Task with title "${input.title}" has been successfully created`;
}

export async function deleteTask(taskId: string | number): Promise<string> {
	// get timelapse id
	const timelapseId = await db
		.select({ timelapseId: taskTimelapse.timelapseId })
		.from(taskTimelapse)
		.where(eq(taskTimelapse.taskId, +taskId));

	if (timelapseId.length > 0) {
		// delete timelapse
		await deleteTimelapseOfTask(timelapseId[0].timelapseId);
	}

	// delete corresponding todos
	const todos = await db.select().from(todo).where(eq(todo.taskId, +taskId));
	await Promise.all(todos.map(async todo => await deleteTodo(todo.todoId)));

	// delete milestones
	// WILL BE IMPLEMENTED IN THE FUTURE

	// delete task
	const deletedTask = await db.delete(task).where(eq(task.taskId, +taskId)).returning();

	return `Task ${deletedTask[0].title} deleted successfully`;
}

export async function editTask(input: MutationEditTaskArgs): Promise<string> {
	const taskList = await db.select().from(task).where(eq(task.taskId, +input.taskId));
	const singleTask = taskList[0];

	if (!singleTask) throw new Error("Task not found");

	await db
		.update(task)
		.set({
			deadline: input.deadline || singleTask.deadline,
			description: input.description || singleTask.description,
			isDone: input.isDone || singleTask.isDone,
			order: input.order || singleTask.order,
			priority: input.priority || singleTask.priority,
			title: input.title || singleTask.title,
		})
		.where(eq(task.taskId, +input.taskId));

	return "Task edited successfully";
}
