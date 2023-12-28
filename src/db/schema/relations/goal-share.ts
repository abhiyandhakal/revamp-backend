import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { goal } from "../goal";
import { user } from "../user";
import { community } from "../community";

export const goalShared = pgTable("goal-shared", {
	sharedId: serial("sharedId").primaryKey(),
	goalId: integer("goalId")
		.references(() => goal.goalId)
		.notNull(),
	userId: text("userId")
		.references(() => user.userId)
		.notNull(),
	communityId: integer("communityId")
		.references(() => community.communityId)
		.notNull(),
	sharedAt: timestamp("sharedAt", { withTimezone: true }).defaultNow(),
});
