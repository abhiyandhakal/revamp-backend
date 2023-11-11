import clerkClient from "@clerk/clerk-sdk-node";
import { Resolvers } from "../generated/graphql";

const resolvers: Resolvers = {
	Query: {
		getUsers: async () => {
			const session = await clerkClient.sessions.getSession("sess_2XyehA15qyuG442UwFwE1rgGVqU");
			const user = await clerkClient.users.getUser(session.userId);
			console.log(user);

			return [
				{
					id: "1",
					name: "John",
					email: "test@john.com",
					password: "test",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			];
		},
	},
};

export default resolvers;
