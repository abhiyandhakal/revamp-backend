import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { journal } from "../journal";
import { user } from "../user";
import { community } from "../community";

export const journalShared = pgTable("journal-shared", {
	sharedId: serial("sharedId").primaryKey(),
	journalId: integer("journalId")
		.references(() => journal.journalId)
		.notNull(),
	userId: text("userId")
		.references(() => user.userId)
		.notNull(),
	communityId: integer("communityId")
		.references(() => community.communityId)
		.notNull(),
	sharedAt: timestamp("sharedAt", { withTimezone: true }).defaultNow(),
});
