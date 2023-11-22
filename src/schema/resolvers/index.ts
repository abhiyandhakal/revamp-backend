import { Resolvers } from "../../generated/graphql";
import { deleteTodo, getSingleTodo, getTodosOfTask, getTodosOfUser, setTodo } from "./todo";
import { deleteTask, getSingleTask, getTasksOfGoal, getTasksOfUser, setTask } from "./task";
import { deleteGoal, editGoal, getGoals, getSingleGoal, setGoal } from "./goal";
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
		getSingleGoal: (_, { goalId }) => getSingleGoal(goalId),
		getSingleTask: (_, { taskId }) => getSingleTask(taskId),
		getSingleTodo: (_, { todoId }) => getSingleTodo(todoId),
		getSingleUser: (_, { userId }) => getSingleUser(userId),
	},

	Mutation: {
		setUser: async (_, { userId }) => setUser(userId),
		setGoal: async (_, args) => setGoal(args),
		setTask: async (_, args) => setTask(args),
		setTodo: async (_, args) => setTodo(args),
		deleteGoal: async (_, { goalId }) => deleteGoal(goalId),
		deleteTask: async (_, { taskId }) => deleteTask(taskId),
		deleteTodo: async (_, { todoId }) => deleteTodo(todoId),
		editGoal: async (_, args) => editGoal(args),
	},
};

export default resolvers;
