import { Resolvers } from "../../generated/graphql";
import { deleteTodo, getSingleTodo, getTodosOfTask, getTodosOfUser, setTodo } from "./todo";
import { getSingleTask, getTasksOfGoal, getTasksOfUser, setTask } from "./task";
import { getGoals, setGoal } from "./goal";
import { getAllQuestions } from "./question";
import { getAllAspects } from "./aspect";
import { getAllUsers, getSingleUser, setUser } from "./user";

const resolvers: Resolvers = {
	Query: {
		getTodosOfTask: (_, { taskId }) => getTodosOfTask(taskId),
		getTodosOfUser: (_, { userId }) => getTodosOfUser(userId),
		getTasksOfGoal: (_, { goalId }) => getTasksOfGoal(goalId),
		getTasksOfUser: (_, { userId }) => getTasksOfUser(userId),
		getGoals: (_, { userId }) => getGoals(userId),
		getAllQuestions,
		getAllAspects,
		getAllUsers,
		getSingleTask: (_, { taskId }) => getSingleTask(taskId),
		getSingleTodo: (_, { todoId }) => getSingleTodo(todoId),
		getSingleUser: (_, { userId }) => getSingleUser(userId),
	},

	Mutation: {
		setUser: async (_, { userId }) => setUser(userId),
		setGoal: async (_, args) => setGoal(args),
		setTask: async (_, args) => setTask(args),
		setTodo: async (_, args) => setTodo(args),
		deleteTodo: async (_, { todoId }) => deleteTodo(todoId),
	},
};

export default resolvers;
