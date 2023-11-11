import { Resolvers } from "../generated/graphql";

const resolvers: Resolvers = {
	Query: {
		getUsers: () => {
			return [
				{
					id: "1",
					name: "John",
					email: "test@john.com",
					password: "test",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			];
		},
	},
};

export default resolvers;
