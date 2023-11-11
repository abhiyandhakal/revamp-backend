import { text, pgTable, boolean, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	userId: text("userId").primaryKey().unique(),
	firstName: text("firstName").notNull(),
	lastName: text("lastName").notNull(),
	username: text("username").notNull(),
	imageUrl: text("imageUrl").notNull(),
	banned: boolean("banned").notNull(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const userEmailAddress = pgTable("user-email", {
	userId: text("userId")
		.notNull()
		.references(() => user.userId),
	emailAddress: text("emailAddress").notNull(),
	isPrimary: boolean("isPrimary").notNull(),
	verified: boolean("verified").notNull(),
});
