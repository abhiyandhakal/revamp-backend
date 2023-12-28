import { Resolvers } from "../../generated/graphql";
import {
	deleteTodo,
	getSingleTodo,
	getTodosOfTask,
	getTodosOfUser,
	setTodo,
	editTodo,
} from "./todo";
import {
	deleteTask,
	editTask,
	getSingleTask,
	getTasksOfGoal,
	getTasksOfUser,
	setTask,
} from "./task";
import { getJournalsOfUser, getSingleJournal, updateJournal } from "./journal";
import {
	deleteGoal,
	shareGoal,
	publishGoal,
	editGoal,
	getGoals,
	getSingleGoal,
	setGoal,
} from "./goal";
import { getAllQuestions } from "./question";
import { getAllAspects } from "./aspect";
import { getAllUsers, getSingleUser, setUser } from "./user";
import {
	getAllCommunities,
	getMyCommunities,
	getSingleCommunity,
	searchCommunities,
	createCommunity,
	leaveCommunity,
	removeUserFromCommunity,
	acceptCommunityInvite,
	declineCommunityInvite,
	inviteUserToCommunity,
	blockUserFromCommunity,
	unBlockUserFromCommunity,
	editCommunity,
	addUserToCommunity,
	makeUserAdminOfCommunity,
	enterInCommunity,
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
		getJournalsOfUser,
		getSingleGoal,
		getSingleTask,
		getSingleTodo,
		getSingleUser,
		getSingleJournal,
		community: getSingleCommunity,
		myCommunities: getMyCommunities,
		communities: getAllCommunities,
		searchCommunities,
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
		shareGoal,
		publishGoal,
		editTask,
		editTodo,
		createCommunity,
		leaveCommunity,
		removeUserFromCommunity,
		acceptCommunityInvite,
		declineCommunityInvite,
		inviteUserToCommunity,
		blockUserFromCommunity,
		unBlockUserFromCommunity,
		editCommunity,
		addUserToCommunity,
		makeUserAdminOfCommunity,
		enterInCommunity,
		updateJournal,
	},
};

export default resolvers;
