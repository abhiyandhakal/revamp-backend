import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { aspect } from "./aspect";

export const tag = pgTable("tag", {
	tagId: serial("tagId").primaryKey(),
	tag: text("tag").notNull(),
	aspectId: integer("aspectId")
		.references(() => aspect.aspectId)
		.notNull(),
});
