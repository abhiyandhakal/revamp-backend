import { createSchema } from "graphql-yoga";
import db from "../db";
import { user } from "../db/schema/user";

export const schema = createSchema({
	typeDefs: /* GraphQL */ `
		type Query {
			hello: String
		}
	`,
	resolvers: {
		Query: {
			hello: async () => {
				const result = await db.select().from(user);
				return JSON.stringify(result);
			},
		},
	},
});
