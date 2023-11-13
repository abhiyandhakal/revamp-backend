import { eq } from "drizzle-orm";
import db from "../../db";
import { todo } from "../../db/schema/todo";
import { Todo } from "../../generated/graphql";
import { todoTimelapse } from "../../db/schema/relations/todo-timelapse";
import { timeLapse } from "../../db/schema/time-lapse";
import { getTimelapse } from "./timelapse";

export async function getTodos(taskId: string): Promise<Todo[]> {
	const todos = await db.select().from(todo).where(eq(todo.taskId, +taskId));

	const finalTodos: Todo[] = await Promise.all(
		todos.map(async singleTodo => {
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
		}),
	);

	return finalTodos;
}
