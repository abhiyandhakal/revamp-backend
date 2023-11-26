import clerkClient from "@clerk/clerk-sdk-node";
import { GraphQLError } from "graphql";
import { shield, rule } from "graphql-shield";
import { YogaInitialContext } from "graphql-yoga";
import db from "../db";
import { user } from "../db/schema/user";
import { eq } from "drizzle-orm";
import { setUserFunc } from "../schema/resolvers/user";

const isAuthenticated = rule()(async (_, args, context: YogaInitialContext) => {
	const sessionId = context.request.headers.get("authorization")?.split(" ")[1];
	if (!sessionId) return new GraphQLError("No session id provided");

	const session = await clerkClient.sessions.getSession(sessionId);
	if (!session) return new GraphQLError("Session not found");

	const userFromClerkSession = await clerkClient.users.getUser(session.userId);

	if (!userFromClerkSession) return new GraphQLError("User not found");

	const userFromDbArr = await db.select().from(user).where(eq(user.userId, session.userId));

	if (userFromDbArr.length === 0) {
		await setUserFunc(session.userId);
	}

	if (args.userId) {
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
