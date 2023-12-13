import { timestamp, pgTable, serial, text } from "drizzle-orm/pg-core";
import { user } from "./user";

export const journal = pgTable("journal", {
	journalId: serial("journalId").primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	type: text("type").notNull(),
	access: text("access").default("private"),
	date: timestamp("date", { withTimezone: true }).notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.userId),
});
