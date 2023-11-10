import { timestamp, pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { user } from "./user";

export const community = pgTable("community", {
	communityId: serial("communityId").primaryKey(),
	community: text("community").notNull(),
	description: text("description").notNull(),
	nametag: text("nametag").notNull(),
	privacy: text("privacy").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
});

export const communityMember = pgTable("communityMember", {
	communityMemberId: integer("communityMemberId")
		.references(() => user.userId)
		.notNull(),
	communityId: integer("communityId")
		.references(() => community.communityId)
		.notNull(),
	role: text("role").notNull(),
});
