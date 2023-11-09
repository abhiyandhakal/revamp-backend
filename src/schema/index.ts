import { createSchema } from "graphql-yoga";
import clerkClient from "@clerk/clerk-sdk-node";

export const schema = createSchema({
	typeDefs: /* GraphQL */ `
		type Query {
			hello: String
		}
	`,
	resolvers: {
		Query: {
			hello: async () => {
				const userList = await clerkClient.users.getUserList();
				const sessions = await clerkClient.sessions.getSessionList();
				console.log(sessions);
				return JSON.stringify(userList);
			},
		},
	},
});
