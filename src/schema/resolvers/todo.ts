import { eq } from "drizzle-orm";
import db from "../../db";
import { todo } from "../../db/schema/todo";
import { MutationResolvers, QueryResolvers, Todo } from "../../generated/graphql";
import { todoTimelapse } from "../../db/schema/relations/todo-timelapse";
import { timeLapse } from "../../db/schema/time-lapse";
import { deleteTimelapseOfTodo, getTimelapse } from "./timelapse";
import { task } from "../../db/schema/task";
import { goal } from "../../db/schema/goal";
import { increaseGoalStreak } from "../../lib/streak";

export const getSingleTodo: QueryResolvers["getSingleTodo"] = async function (_, { todoId }) {
	const todos = await db.select().from(todo).where(eq(todo.todoId, todoId));
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
		todoId: singleTodo.todoId,
		timelapsed: timelapsedTotal,
	};
};

export async function sqlToGqlTodo(singleTodo: typeof todo.$inferSelect): Promise<Todo> {
	const timelapseds = await db
		.select()
		.from(todoTimelapse)
		.innerJoin(timeLapse, eq(timeLapse.timelapseId, todoTimelapse.timelapseId))
		.where(eq(todoTimelapse.todoId, singleTodo.todoId));

	const timelapsed = timelapseds[0];

	let gqlTodo: Todo = {
		...singleTodo,
		todoId: singleTodo.todoId,
	};

	if (timelapsed) {
		const timelapsedTotal = await getTimelapse(timelapsed.timelapse.timelapseId);
		gqlTodo = { ...gqlTodo, timelapsed: timelapsedTotal };
	}

	return gqlTodo;
}

export const getTodosOfTask: QueryResolvers["getTodosOfTask"] = async (_, { taskId }) => {
	const todos = await db.select().from(todo).where(eq(todo.taskId, taskId));

	const finalTodos: Todo[] = await Promise.all(
		todos.map(async singleTodo => await sqlToGqlTodo(singleTodo)),
	);

	return finalTodos;
};

export const getTodosOfUser: QueryResolvers["getTodosOfUser"] = async function (_, { userId }) {
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
};

export const setTodo: MutationResolvers["setTodo"] = async function (_, args) {
	await db.insert(todo).values({ ...args, taskId: args.taskId });

	return `Todo ${args.todo} created successfully`;
};

export const deleteTodoFunc = async (todoId: number): Promise<string> => {
	// get timelapse id
	const timelapseId = await db
		.select({ timelapseId: todoTimelapse.timelapseId })
		.from(todoTimelapse)
		.where(eq(todoTimelapse.todoId, todoId));

	if (timelapseId.length > 0) {
		// delete timelapse
		await deleteTimelapseOfTodo(timelapseId[0].timelapseId);
	}

	// delete todo
	const deletedTodo = await db.delete(todo).where(eq(todo.todoId, todoId)).returning();

	return `Todo ${deletedTodo[0].todo} deleted successfully`;
};

export const deleteTodo: MutationResolvers["deleteTodo"] = async function (_, { todoId }) {
	return await deleteTodoFunc(todoId);
};

export const editTodo: MutationResolvers["editTodo"] = async function (_, args) {
	const todoArr = await db.select().from(todo).where(eq(todo.todoId, args.todoId));
	const singleTodo = todoArr[0];

	if (!singleTodo) throw new Error("Todo not found");

	await db.update(todo).set({
		isDone: args.isDone == undefined ? singleTodo.isDone : args.isDone,
		order: args.order || singleTodo.order,
		todo: args.todo || singleTodo.todo,
		updatedAt: new Date(),
	});

	if (args.isDone) {
		const goalIdArr = await db
			.select({ goalId: task.goalId })
			.from(todo)
			.innerJoin(task, eq(task.taskId, todo.taskId))
			.where(eq(todo.todoId, args.todoId));
		const goalId = goalIdArr[0]?.goalId;
		if (!goalId) throw new Error("Todo doesn't belong to any goal");

		increaseGoalStreak(goalId);
	}

	return "Todo edited successfully";
};
