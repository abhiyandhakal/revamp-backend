import { timestamp, pgTable, serial, text } from "drizzle-orm/pg-core";

export const community = pgTable("community", {
	communityId: serial("communityId").primaryKey(),
	community: text("community").notNull(),
	description: text("description").notNull(),
	nametag: text("nametag").notNull(),
	privacy: text("privacy").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
});
