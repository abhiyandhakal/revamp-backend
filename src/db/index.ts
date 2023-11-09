import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DB_URL || "...";
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

export default db;
