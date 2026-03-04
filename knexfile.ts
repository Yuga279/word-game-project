import "dotenv/config";
import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "pg",
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        },
        acquireConnectionTimeout: 60000,
        pool: { min: 1, max: 5 },
        migrations: {
            directory: "./server/db/migrations",
            extension: "ts",
        },
        seeds: {
            directory: "./server/db/seeds",
            extension: "ts",
        },
    },
    production: {
        client: "pg",
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        },
        pool: { min: 2, max: 10 },
        migrations: {
            directory: "./server/db/migrations",
            extension: "ts",
        },
        seeds: {
            directory: "./server/db/seeds",
            extension: "ts",
        },
    },
};

export default config;
