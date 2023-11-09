import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { aspect } from "./aspect";
import { user } from "./user";

export const tag = pgTable("tag", {
	tagId: serial("tagId").primaryKey(),
	tag: text("tag").notNull(),
	aspectId: integer("aspectId").references(() => aspect.aspectId),
	userId: text("userId").references(() => user.userId),
});
