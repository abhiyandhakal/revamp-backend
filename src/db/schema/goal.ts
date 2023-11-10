import { text, pgTable, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./user";

export const goal = pgTable("goal", {
	goalId: serial("goalId").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	priority: text("priority").default("medium"),
	relatedArea: text("relatedArea"),
	streak: integer("streak").notNull().default(0),
	status: text("status").notNull().default("active"),
	deadline: timestamp("deadline", { withTimezone: true }),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	order: serial("order"),
	userId: text("userId")
		.notNull()
		.references(() => user.userId),
});
