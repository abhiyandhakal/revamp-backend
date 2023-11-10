import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "../user";
import { community } from "../community";

export const userCommunity = pgTable("user-community", {
	userId: text("userId").references(() => user.userId),
	communityId: integer("communityId").references(() => community.communityId),
});
