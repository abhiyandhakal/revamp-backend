import db from "../../db";
import { User, UserEmailAddress } from "../../generated/graphql";
import { user, userEmailAddress } from "../../db/schema/user";
import { eq } from "drizzle-orm";
import { getAspectsOfUser } from "./aspect";
import { getGoals } from "./goal";

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
		id: userInDb[0].userId,
		aspects,
		journals: [],
		goals,
		emailAddresses,
	};
};
