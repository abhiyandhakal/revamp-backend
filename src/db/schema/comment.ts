import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

import { user } from "./user";
import { journal } from "./journal";

export const comment = pgTable("comment", {
	commentId: serial("commentId").primaryKey(),
	comment: text("comment").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }),
	userId: text("userId")
		.references(() => user.userId)
		.notNull(),
	journalId: integer("journalId")
		.references(() => journal.journalId)
		.notNull(),
});
