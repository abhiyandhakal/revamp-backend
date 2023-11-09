import { serial, text, pgTable } from "drizzle-orm/pg-core";
import { user } from "./user";

export const aspect = pgTable("aspect", {
	aspectId: serial("aspectId").primaryKey(),
	aspect: text("aspect").notNull(),
	userId: text("userId").references(() => user.userId),
});
