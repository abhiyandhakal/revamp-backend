import { text, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	userId: text("userId").primaryKey().unique(),
});
