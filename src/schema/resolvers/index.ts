import { Resolvers } from "../../generated/graphql";
import { getTodos } from "./todo";
import { getSingleTask, getTasksOfGoal, getTasksOfUser, setTask } from "./task";
import { getGoals, setGoal } from "./goal";
import { getAllQuestions } from "./question";
import { getAllAspects } from "./aspect";
import { getAllUsers, getSingleUser, setUser } from "./user";

const resolvers: Resolvers = {
	Query: {
		getTodos: (_, { taskId }) => getTodos(taskId),
		getTasksOfGoal: (_, { goalId }) => getTasksOfGoal(goalId),
		getTasksOfUser: (_, { userId }) => getTasksOfUser(userId),
		getGoals: (_, { userId }) => getGoals(userId),
		getAllQuestions,
		getAllAspects,
		getAllUsers,
		getSingleTask: (_, { taskId }) => getSingleTask(taskId),
		getSingleUser: (_, { userId }) => getSingleUser(userId),
	},

	Mutation: {
		setUser: async (_, { userId }) => setUser(userId),
		setGoal: async (_, args) => setGoal(args),
		setTask: async (_, args) => setTask(args),
	},
};

export default resolvers;
