import { createSchema } from "graphql-yoga";
import path from "path";
import fs from "fs";
import resolvers from "./resolvers";

const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

export const schema = createSchema({
	typeDefs,
	resolvers,
});
