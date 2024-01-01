import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "../user";
import { goal } from "../goal";

export const userLikesGoal = pgTable("user-likes-goal", {
	likeId: serial("likeId").primaryKey(),
	userId: text("userId")
		.references(() => user.userId)
		.notNull(),
	goalId: integer("goalId")
		.references(() => goal.goalId)
		.notNull(),
	likedAt: timestamp("likedAt", { withTimezone: true }).notNull(),
});
