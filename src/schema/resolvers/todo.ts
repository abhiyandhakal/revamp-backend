import { eq } from "drizzle-orm";
import db from "../../db";
import { todo } from "../../db/schema/todo";
import { Todo } from "../../generated/graphql";
import { todoTimelapse } from "../../db/schema/relations/todo-timelapse";
import { pauseTime, resumeTime, timeLapse } from "../../db/schema/time-lapse";

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

			const pauseTimes = await db
				.select()
				.from(pauseTime)
				.where(eq(pauseTime.timeLapseId, timelapsed.timelapse.timelapseId));

			const resumeTimes = await db
				.select()
				.from(resumeTime)
				.where(eq(resumeTime.timeLapseId, timelapsed.timelapse.timelapseId));

			// get duration from timestamp (days, hours, minutes, seconds)
			const duration = timelapsed.timelapse.duration?.getTime() || 0;
			const days = Math.floor(duration / (1000 * 60 * 60 * 24));
			const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((duration % (1000 * 60)) / 1000);

			return {
				...singleTodo,
				todoId: singleTodo.todoId.toString(),
				timelapsed: {
					...timelapsed.timelapse,
					timelapseId: timelapsed.timelapse.timelapseId.toString(),
					duration: {
						days,
						hours,
						minutes,
						seconds,
					},
					pausetimes: pauseTimes.map(pausetime => ({
						pausetimeId: pausetime.pauseTimeId.toString(),
						pauseTime: pausetime.pauseTime,
					})),
					resumetimes: resumeTimes.map(resumetime => ({
						resumetimeId: resumetime.resumeTimeId.toString(),
						resumeTime: resumetime.resumeTime,
					})),
				},
			};
		}),
	);

	return finalTodos;
}
