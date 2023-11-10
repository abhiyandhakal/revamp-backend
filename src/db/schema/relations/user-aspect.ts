import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { user } from "../user";
import { aspect } from "../aspect";

export const userAspect = pgTable("user-aspect", {
	userId: text("userId")
		.references(() => user.userId)
		.notNull(),
	aspectId: integer("aspectId")
		.references(() => aspect.aspectId)
		.notNull(),
});
