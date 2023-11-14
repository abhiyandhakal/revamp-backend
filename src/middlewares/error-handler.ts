import { GraphQLError } from "graphql";

const errorHandler = async (resolve: any, root: any, args: any, context: any, info: any) => {
	try {
		const result = await resolve(root, args, context, info);
		return result;
	} catch (error) {
		if (error instanceof Error) {
			return new GraphQLError(error.message);
		}
		return new GraphQLError("An unknown error occurred");
	}
};

export default errorHandler;
