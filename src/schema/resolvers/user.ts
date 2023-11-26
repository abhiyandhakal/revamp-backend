import db from "../../db";
import { User, UserEmailAddress } from "../../generated/graphql";
import { user, userEmailAddress } from "../../db/schema/user";
import { eq } from "drizzle-orm";
import { getAspectsOfUser } from "./aspect";
import { getGoals } from "./goal";
import clerkClient from "@clerk/clerk-sdk-node";

const getUserEmailAddresses = async (userId: string): Promise<UserEmailAddress[]> => {
	const userEmailAddresses = await db
		.select()
		.from(userEmailAddress)
		.where(eq(userEmailAddress.userId, userId));

	return userEmailAddresses;
};

export const getSingleUser = async (userId: string): Promise<User> => {
	const userInDb = await db.select().from(user).where(eq(user.userId, userId));

	if (userInDb.length === 0) throw new Error("User does not exist");

	const aspects = await getAspectsOfUser(userId);
	const goals = await getGoals(userId);
	const emailAddresses = await getUserEmailAddresses(userId);

	return {
		...userInDb[0],
		aspects,
		journals: [],
		goals,
		emailAddresses,
		communities: [],
	};
};

export const getAllUsers = async (): Promise<User[]> => {
	const userIds = await db.select({ userId: user.userId }).from(user);

	const users = await Promise.all(
		userIds.map(async singleUser => getSingleUser(singleUser.userId)),
	);

	return users;
};

export const setUser = async (userId: string): Promise<string> => {
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
};
