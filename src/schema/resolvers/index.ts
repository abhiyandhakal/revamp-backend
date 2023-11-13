import { Resolvers } from "../../generated/graphql";
import db from "../../db";
import { user, userEmailAddress } from "../../db/schema/user";
import { eq } from "drizzle-orm";
import clerkClient from "@clerk/clerk-sdk-node";
import { getTodos } from "./todo";
import { getTasks } from "./task";

const resolvers: Resolvers = {
	Query: {
		getTodos: (_, { taskId }) => getTodos(taskId),
		getTasks: (_, { goalId }) => getTasks(goalId),
	},

	Mutation: {
		async setUser(_, { userId }) {
			const userInDb = await db.select().from(user).where(eq(user.userId, userId));

			if (userInDb.length !== 0) {
				throw new Error("User already exists");
			}

			const userInClerk = await clerkClient.users.getUser(userId);

			if (!userInClerk) throw new Error("User does not exist in Clerk");

			// insert into account (user) table
			type NewUser = typeof user.$inferInsert;
			const newUser: NewUser = {
				userId: userInClerk.id,
				firstName: userInClerk.firstName || "",
				lastName: userInClerk.lastName || "",
				username: userInClerk.username || "",
				imageUrl: userInClerk.imageUrl,
				banned: userInClerk.banned,
				createdAt: new Date(userInClerk.createdAt),
				updatedAt: new Date(userInClerk.updatedAt),
			};
			await db.insert(user).values(newUser);

			// insert into user-email table
			type NewUserEmailAddress = typeof userEmailAddress.$inferInsert;

			for (let i = 0; i < userInClerk.emailAddresses.length; i++) {
				const email = userInClerk.emailAddresses[i];

				const newUserEmailAddress: NewUserEmailAddress = {
					userId: newUser.userId,
					emailAddress: email.emailAddress,
					verified: email.verification?.status === "verified",
					isPrimary: userInClerk.primaryEmailAddressId === email.id,
				};

				await db.insert(userEmailAddress).values(newUserEmailAddress);
			}

			return "User created successfully";
		},
	},
};

export default resolvers;
