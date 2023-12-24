import { text, pgTable, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const user = pgTable("account", {
	userId: text("userId").primaryKey().unique(),
	firstName: text("firstName").notNull(),
	lastName: text("lastName").notNull(),
	username: text("username").notNull(),
	imageUrl: text("imageUrl").notNull(),
	banned: boolean("banned").notNull(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	timezone: text("timezone").notNull(),
	streak: integer("streak").notNull().default(0),
	streakUpdatedAt: timestamp("streakUpdatedAt"),
});

export const userEmailAddress = pgTable("user-email", {
	userId: text("userId")
		.notNull()
		.references(() => user.userId),
	emailAddress: text("emailAddress").primaryKey(),
	isPrimary: boolean("isPrimary").notNull(),
	verified: boolean("verified").notNull(),
});
