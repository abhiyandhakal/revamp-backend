import { Resolvers } from "../../generated/graphql";
import { deleteTodo, getSingleTodo, getTodosOfTask, getTodosOfUser, setTodo } from "./todo";
import {
	deleteTask,
	editTask,
	getSingleTask,
	getTasksOfGoal,
	getTasksOfUser,
	setTask,
} from "./task";
import { getJournalsOfUser, getSingleJournal } from "./journal";
import { deleteGoal, editGoal, getGoals, getSingleGoal, setGoal } from "./goal";
import { getAllQuestions } from "./question";
import { getAllAspects } from "./aspect";
import { getAllUsers, getSingleUser, setUser } from "./user";

const resolvers: Resolvers = {
	Query: {
		getTodosOfTask,
		getTodosOfUser,
		getTasksOfGoal,
		getTasksOfUser,
		getGoals,
		getAllQuestions,
		getAllAspects,
		getAllUsers,
		getJournalsOfUser,
		getSingleGoal,
		getSingleTask,
		getSingleTodo,
		getSingleUser,
		getSingleJournal,
	},

	Mutation: {
		setUser,
		setGoal,
		setTask,
		setTodo,
		deleteGoal,
		deleteTask,
		deleteTodo,
		editGoal,
		editTask,
	},
};

export default resolvers;
