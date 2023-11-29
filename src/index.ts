import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";
import { applyMiddleware } from "graphql-middleware";
import { EnvelopArmor } from "@escape.tech/graphql-armor";
import permissions from "./middlewares/permissions";
import errorHandler from "./middlewares/error-handler";

// dotenv config
import * as dotenv from "dotenv";
dotenv.config();

const port: string = process.env?.PORT || "4000";

// graphql armor
const armor = new EnvelopArmor({
	maxDepth: {
		enabled: true,
		n: 10,
	},
});
const protection = armor.protect();

const schemaWithMiddleware = applyMiddleware(schema, permissions, errorHandler);

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
	schema: schemaWithMiddleware,
	plugins: [...protection.plugins],
	graphiql: process.env.NODE_ENV === "development",
	landingPage: false,
});

// Pass it into a server to hook into request handlers.
const server = createServer(yoga);

// Start the server and you're done!
server.listen(port, () => {
	console.info(`Server is running on http://localhost:${port}/graphql`);
});
