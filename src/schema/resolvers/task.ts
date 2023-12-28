import { eq, sql } from "drizzle-orm";
import db from "../../db";
import { milestone, task } from "../../db/schema/task";
import { MutationResolvers, QueryResolvers, Task } from "../../generated/graphql";
import { taskTimelapse } from "../../db/schema/relations/task-timelapse";
import { deleteTimelapseOfTask, getTimelapse } from "./timelapse";
import { goal } from "../../db/schema/goal";
import { deleteTodoFunc, sqlToGqlTodo } from "./todo";
import { todo } from "../../db/schema/todo";
import { increaseGoalStreak } from "../../lib/streak";
import { workedOnLog } from "../../db/schema/worked-on-log";

export const getSingleTask: QueryResolvers["getSingleTask"] = async function (_, { taskId }) {
	const taskList = await db.select().from(task).where(eq(task.taskId, taskId));
	const singleTask = taskList[0];

	if (!singleTask) throw new Error("Task not found");

	const result = await sqlToGqlTask(singleTask);

	return result;
};

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
		priority: singleTask.priority || "",
		timelapsed: timelapsed || null,
		todos: finalTodos,
		milestones,
	};
}

export const getTasksOfGoalFunc = async function (goalId: number): Promise<Task[]> {
	const tasks = await db.select().from(task).where(eq(task.goalId, goalId));
	const tasksWithTodos: Task[] = await Promise.all(
		tasks.map(async singleTask => sqlToGqlTask(singleTask)),
	);

	return tasksWithTodos;
};
export const getTasksOfGoal: QueryResolvers["getTasksOfGoal"] = async (_, { goalId }) =>
	await getTasksOfGoalFunc(goalId);

export const getTasksOfUser: QueryResolvers["getTasksOfUser"] = async function (_, { userId }) {
	const tasks = await db
		.select()
		.from(task)
		.innerJoin(goal, eq(goal.goalId, task.goalId))
		.where(eq(goal.userId, userId));
	const tasksWithTodos: Task[] = await Promise.all(
		tasks.map(async singleTask => await sqlToGqlTask(singleTask.task)),
	);

	return tasksWithTodos;
};

export const setTask: MutationResolvers["setTask"] = async function (_, input) {
	await db.insert(task).values({ ...input, goalId: input.goalId });

	return `Task with title "${input.title}" has been successfully created`;
};

export const deleteTaskFunc = async function (taskId: number): Promise<string> {
	// get timelapse id
	const timelapseId = await db
		.select({ timelapseId: taskTimelapse.timelapseId })
		.from(taskTimelapse)
		.where(eq(taskTimelapse.taskId, taskId));

	if (timelapseId.length > 0) {
		// delete timelapse
		await deleteTimelapseOfTask(timelapseId[0].timelapseId);
	}

	// delete corresponding todos
	const todos = await db.select().from(todo).where(eq(todo.taskId, taskId));
	await Promise.all(todos.map(async todo => await deleteTodoFunc(todo.todoId)));

	// delete milestones
	// WILL BE IMPLEMENTED IN THE FUTURE

	// delete task
	const deletedTask = await db.delete(task).where(eq(task.taskId, taskId)).returning();

	return `Task ${deletedTask[0].title} deleted successfully`;
};
export const deleteTask: MutationResolvers["deleteTask"] = async (_, { taskId }) =>
	await deleteTaskFunc(taskId);

export const editTask: MutationResolvers["editTask"] = async function (_, input) {
	const taskList = await db.select().from(task).where(eq(task.taskId, input.taskId));
	const singleTask = taskList[0];
	const previouslyDone = singleTask.isDone;

	if (!singleTask) throw new Error("Task not found");

	await db
		.update(task)
		.set({
			deadline: input.deadline || singleTask.deadline,
			description: input.description || singleTask.description,
			isDone: input.isDone != undefined ? input.isDone : singleTask.isDone,
			order: input.order || singleTask.order,
			priority: input.priority || singleTask.priority,
			title: input.title || singleTask.title,
			updatedAt: new Date(),
		})
		.where(eq(task.taskId, input.taskId));

	if (input.isDone && !previouslyDone) {
		const statement = sql`SELECT * FROM ${workedOnLog} WHERE DATE(${workedOnLog.date}) = CURRENT_DATE AND ${workedOnLog.taskId} = ${input.taskId}`;
		const workedOnTasks = (await db.execute(statement)) as (typeof workedOnLog.$inferSelect)[];

		if (workedOnTasks.length === 0) {
			db.insert(workedOnLog).values({
				taskId: input.taskId,
				goalId: singleTask.goalId,
			});
		}

		increaseGoalStreak(singleTask.goalId);
	}

	return "Task edited successfully";
};
