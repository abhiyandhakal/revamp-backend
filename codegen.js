/** @type {import("@graphql-codegen/cli").CodegenConfig} */
const config = {
	overwrite: true,
	schema: "./graphql/schema.graphql",
	generates: {
		"src/generated/graphql.ts": {
			plugins: ["typescript", "typescript-resolvers"],
		},
	},
};

module.exports = config;
