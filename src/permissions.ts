import clerkClient from "@clerk/clerk-sdk-node";
import { shield, rule } from "graphql-shield";
import { YogaInitialContext } from "graphql-yoga";

const isAuthenticated = rule()(async (_, __, context: YogaInitialContext) => {
	const sessionId = context.request.headers.get("authorization")?.split(" ")[1];
	if (!sessionId) return false;

	const session = await clerkClient.sessions.getSession(sessionId);
	if (!session) return false;

	const expiryDate = new Date(session.expireAt);
	if (expiryDate < new Date()) return false;

	return true;
});

const permissions = shield(
	{
		Query: {
			"*": isAuthenticated,
		},
	},
	{
		fallbackError: new Error("Unauthorized"),
	},
);

export default permissions;
