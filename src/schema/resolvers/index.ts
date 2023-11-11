import clerkClient from "@clerk/clerk-sdk-node";
import { Resolvers } from "../../generated/graphql";

const resolvers: Resolvers = {
	Query: {
		getUsers: async () => {
			const users = await clerkClient.users.getUserList();

			const trimmedUsers = users.map(user => {
				return {
					id: user.id,
					name: `${user.firstName} ${user.lastName}`,
					email: user.emailAddresses[0].emailAddress,
					password: "test",
					createdAt: user.createdAt.toString(),
					updatedAt: user.updatedAt.toString(),
				};
			});

			return trimmedUsers;
		},
	},
};

export default resolvers;
