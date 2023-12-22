import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "../user";
import { community } from "../community";

// user has to accept invite to join community
export const userCommunity = pgTable("user-community", {
	userId: text("userId").references(() => user.userId),
	communityId: integer("communityId").references(() => community.communityId),
	role: text("role").notNull(),
	status: text("invite").default("pending").notNull(),
});
