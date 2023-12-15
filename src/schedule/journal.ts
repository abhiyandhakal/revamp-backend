import db from "../db";
import { user } from "../db/schema/user";
import { journal } from "../db/schema/journal";

export const dailyJournalSchedule = async () => {
	// create a new journal for each user
	const users = await db.select().from(user);

	const date = new Date();
	const dateOnly = date.toLocaleDateString();

	users.forEach(singleUser => {
		db.insert(journal).values({
			title: `Journal for ${dateOnly}`,
			content: `Journal for ${dateOnly}`,
			userId: singleUser.userId,
			type: "daily",
			date,
		});
	});
};

export const weeklyJournalSchedule = async () => {
	// create a new journal for each user
	const users = await db.select().from(user);

	const date = new Date();
	const dateOnly = date.toLocaleDateString();

	users.forEach(singleUser => {
		db.insert(journal).values({
			title: `Journal for ${dateOnly}`,
			content: `Journal for ${dateOnly}`,
			userId: singleUser.userId,
			type: "weekly",
			date,
		});
	});
};

export const monthlyJournalSchedule = async () => {
	// create a new journal for each user
	const users = await db.select().from(user);

	const date = new Date();
	const dateOnly = date.toLocaleDateString();

	users.forEach(singleUser => {
		db.insert(journal).values({
			title: `Journal for ${dateOnly}`,
			content: `Journal for ${dateOnly}`,
			userId: singleUser.userId,
			type: "monthly",
			date,
		});
	});
};
