import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "../user";
import { journal } from "../journal";

export const userLikesJournal = pgTable("user-likes-journal", {
	likeId: serial("likeId").primaryKey(),
	userId: text("userId")
		.references(() => user.userId)
		.notNull(),
	journalId: integer("journalId")
		.references(() => journal.journalId)
		.notNull(),
	likedAt: timestamp("likedAt", { withTimezone: true }).notNull(),
});
