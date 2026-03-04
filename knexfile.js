import dotenv from "dotenv";
dotenv.config();
const config = {
    development: {
        client: "pg",
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        },
        migrations: {
            directory: "./server/db/migrations",
        },
        seeds: {
            directory: "./server/db/seeds",
        },
    },
    production: {
        client: "pg",
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: "./server/db/migrations",
        },
        seeds: {
            directory: "./server/db/seeds",
        },
    },
};
export default config;
