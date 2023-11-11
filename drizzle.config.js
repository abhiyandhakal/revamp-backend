const { Config } = require("drizzle-kit");
require("dotenv").config();

/*
 * @type {Config}
 */
module.exports = {
	schema: "./src/db/schema",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DB_URL || "",
	},
};
