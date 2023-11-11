import { shield, rule } from "graphql-shield";
import { YogaInitialContext } from "graphql-yoga";

const isAuthenticated = rule()(async (_, __, context: YogaInitialContext) => {
	console.log(context.request.headers);

	return true;
});

const permissions = shield({
	Query: {
		"*": isAuthenticated,
	},
});

export default permissions;
