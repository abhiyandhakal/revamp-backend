import { createSchema } from "graphql-yoga";
import path from "path";
import fs from "fs";
import resolvers from "./resolvers";
import { typeDefs as scalarTypeDefs } from "graphql-scalars";

const typeDefs = fs.readFileSync(path.join("./graphql/schema.graphql"), "utf8");

export const schema = createSchema({
	typeDefs: [scalarTypeDefs, typeDefs],
	resolvers,
});
