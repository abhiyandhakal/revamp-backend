import clerkClient from "@clerk/clerk-sdk-node";
import { GraphQLError } from "graphql";
import { shield, rule } from "graphql-shield";
import { YogaInitialContext } from "graphql-yoga";

const isAuthenticated = rule()(async (_, args, context: YogaInitialContext) => {
	const sessionId = context.request.headers.get("authorization")?.split(" ")[1];
	if (!sessionId) return new GraphQLError("No session id provided");

	const session = await clerkClient.sessions.getSession(sessionId);
	if (!session) return new GraphQLError("Session not found");

	if (args.userId) {
		const userFromClerkSession = await clerkClient.users.getUser(session.userId);

		if (userFromClerkSession.id !== args.userId) {
			return new GraphQLError("User id does not match with the session user id");
		}
	}

	const expiryDate = new Date(session.expireAt);
	if (expiryDate < new Date()) return new GraphQLError("Session expired");

	return true;
});

const permissions = shield(
	{
		Query: {
			"*": isAuthenticated,
		},
		Mutation: {
			"*": isAuthenticated,
		},
	},
	{
		async fallbackError(error) {
			if (error instanceof GraphQLError) {
				return new GraphQLError(error.message);
			}

			return new GraphQLError("Authorization Error");
		},
	},
);

export default permissions;
