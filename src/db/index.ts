import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = "...";
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

export default db;
