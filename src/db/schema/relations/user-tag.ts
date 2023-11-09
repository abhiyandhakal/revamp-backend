import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { user } from "../user";
import { tag } from "../tag";

export const userTag = pgTable("user-tag", {
	userId: text("userId")
		.references(() => user.userId)
		.notNull(),
	tagId: integer("tagId")
		.references(() => tag.tagId)
		.notNull(),
});
