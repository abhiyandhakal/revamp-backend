require("dotenv").config();

/** @type { import("drizzle-kit").Config } */
module.exports = {
	schema: "./src/db/schema/**/*",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DB_URL || "",
	},
};
