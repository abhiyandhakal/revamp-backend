import schedule from "node-schedule";
import db from "../db";
import { user } from "../db/schema/user";
import { journal } from "../db/schema/journal";

// create daily journal
schedule.scheduleJob("0 0 * * *", async () => {
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
});

// create weekly journal
schedule.scheduleJob("0 0 * * 0", async () => {
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
});

// create monthly journal
schedule.scheduleJob("0 0 1 * *", async () => {
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
});
