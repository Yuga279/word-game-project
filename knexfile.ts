import "dotenv/config";
import type { Knex } from "knex";

const isProduction = process.env.NODE_ENV === "production";
const extension = isProduction ? "js" : "ts";
const migrationDir = isProduction ? "./dist/server/server/db/migrations" : "./server/db/migrations";
const seedDir = isProduction ? "./dist/server/server/db/seeds" : "./server/db/seeds";

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
            directory: migrationDir,
            extension: extension,
        },
        seeds: {
            directory: seedDir,
            extension: extension,
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
            directory: migrationDir,
            extension: extension,
        },
        seeds: {
            directory: seedDir,
            extension: extension,
        },
    },
};

export default config;
