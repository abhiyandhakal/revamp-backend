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
import { deleteGoal, editGoal, getGoals, getSingleGoal, setGoal } from "./goal";
import { getAllQuestions } from "./question";
import { getAllAspects } from "./aspect";
import { getAllUsers, getSingleUser, setUser } from "./user";
import {
	getAllCommunities,
	getSingleCommunity,
	createCommunity,
	leaveCommunity,
	acceptCommunityInvite,
	declineCommunityInvite,
	inviteUserToCommunity,
} from "./community";

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
		getSingleGoal,
		getSingleTask,
		getSingleTodo,
		getSingleUser,
		community: getSingleCommunity,
		communities: getAllCommunities,
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
		createCommunity,
		leaveCommunity,
		acceptCommunityInvite,
		declineCommunityInvite,
		inviteUserToCommunity,
	},
};

export default resolvers;
