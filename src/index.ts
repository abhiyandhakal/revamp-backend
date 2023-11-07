import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";

// dotenv config
import * as dotenv from "dotenv";
dotenv.config();

const port: string = process.env?.PORT || "4000";

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({ schema });

// Pass it into a server to hook into request handlers.
const server = createServer(yoga);

// Start the server and you're done!
server.listen(port, () => {
	console.info(`Server is running on http://localhost:${port}/graphql`);
});
