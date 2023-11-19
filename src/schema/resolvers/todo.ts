import { eq } from "drizzle-orm";
import db from "../../db";
import { todo } from "../../db/schema/todo";
import { MutationSetTodoArgs, Todo } from "../../generated/graphql";
import { todoTimelapse } from "../../db/schema/relations/todo-timelapse";
import { timeLapse } from "../../db/schema/time-lapse";
import { getTimelapse } from "./timelapse";
import { task } from "../../db/schema/task";
import { goal } from "../../db/schema/goal";

export async function getSingleTodo(todoId: string | number): Promise<Todo> {
	const todos = await db.select().from(todo).where(eq(todo.todoId, +todoId));
	const singleTodo = todos[0];

	if (!singleTodo) throw new Error("Todo not found");

	const timelapseds = await db
		.select()
		.from(todoTimelapse)
		.innerJoin(timeLapse, eq(timeLapse.timelapseId, todoTimelapse.timelapseId))
		.where(eq(todoTimelapse.todoId, singleTodo.todoId));

	const timelapsed = timelapseds[0];

	const timelapsedTotal = await getTimelapse(timelapsed.timelapse.timelapseId);

	return {
		...singleTodo,
		todoId: singleTodo.todoId.toString(),
		timelapsed: timelapsedTotal,
	};
}

export async function sqlToGqlTodo(singleTodo: typeof todo.$inferSelect): Promise<Todo> {
	const timelapseds = await db
		.select()
		.from(todoTimelapse)
		.innerJoin(timeLapse, eq(timeLapse.timelapseId, todoTimelapse.timelapseId))
		.where(eq(todoTimelapse.todoId, singleTodo.todoId));

	const timelapsed = timelapseds[0];

	const timelapsedTotal = await getTimelapse(timelapsed.timelapse.timelapseId);

	return {
		...singleTodo,
		todoId: singleTodo.todoId.toString(),
		timelapsed: timelapsedTotal,
	};
}

export async function getTodosOfTask(taskId: number | string): Promise<Todo[]> {
	const todos = await db.select().from(todo).where(eq(todo.taskId, +taskId));

	const finalTodos: Todo[] = await Promise.all(
		todos.map(async singleTodo => await sqlToGqlTodo(singleTodo)),
	);

	return finalTodos;
}

export async function getTodosOfUser(userId: string): Promise<Todo[]> {
	const todos = await db
		.select()
		.from(todo)
		.innerJoin(task, eq(task.taskId, todo.taskId))
		.innerJoin(goal, eq(goal.goalId, task.goalId))
		.where(eq(goal.userId, userId));

	const finalTodos: Todo[] = await Promise.all(
		todos.map(async singleTodo => await sqlToGqlTodo(singleTodo.todo)),
	);

	return finalTodos;
}

export async function setTodo(args: MutationSetTodoArgs): Promise<string> {
	await db.insert(todo).values({ ...args, taskId: +args.taskId });

	return `Todo ${args.todo} created successfully`;
}

export async function deleteTodo(todoId: string | number): Promise<string> {
	// get timelapse id
	const timelapseId = await db
		.select()
		.from(todoTimelapse)
		.where(eq(todoTimelapse.todoId, +todoId));

	if (timelapseId.length > 0) {
		// delete timelapse
		await db.delete(timeLapse).where(eq(timeLapse.timelapseId, timelapseId[0].timelapseId));
	}

	// delete todo
	const deletedTodo = await db.delete(todo).where(eq(todo.todoId, +todoId)).returning();

	return `Todo ${deletedTodo[0].todo} deleted successfully`;
}
