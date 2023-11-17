import { Resolvers } from "../../generated/graphql";
import { getTodos } from "./todo";
import { getTasks } from "./task";
import { getGoals, setGoal } from "./goal";
import { getAllQuestions } from "./question";
import { getAllAspects } from "./aspect";
import { getAllUsers, getSingleUser, setUser } from "./user";

const resolvers: Resolvers = {
	Query: {
		getTodos: (_, { taskId }) => getTodos(taskId),
		getTasks: (_, { goalId }) => getTasks(goalId),
		getGoals: (_, { userId }) => getGoals(userId),
		getAllQuestions,
		getAllAspects,
		getAllUsers,
		getSingleUser: (_, { userId }) => getSingleUser(userId),
	},

	Mutation: {
		setUser: async (_, { userId }) => setUser(userId),
		setGoal: async (_, args) => setGoal(args),
	},
};

export default resolvers;
