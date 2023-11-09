import { serial, text, pgTable } from "drizzle-orm/pg-core";

export const aspect = pgTable("aspect", {
	aspectId: serial("aspectId").primaryKey(),
	aspect: text("aspect").notNull(),
});
