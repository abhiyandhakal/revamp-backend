import("dotenv").config();

/** @type { import("drizzle-kit").Config } */
export default {
	schema: "./schema.ts",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DB_URL,
	},
};
