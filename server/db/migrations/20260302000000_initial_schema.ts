import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Users table
    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("username").unique().notNullable();
        table.string("email").unique().notNullable();
        table.string("password_hash").notNullable();
        table.string("avatar_url");
        table.integer("total_games").defaultTo(0);
        table.integer("wins").defaultTo(0);
        table.timestamps(true, true);
    });

    // Word Pairs table
    await knex.schema.createTable("word_pairs", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("category").notNullable();
        table.string("difficulty").notNullable(); // Easy, Medium, Hard
        table.string("word_a").notNullable();
        table.string("word_b").notNullable();
        table.boolean("active").defaultTo(true);
        table.timestamps(true, true);
    });

    // Games table (Active sessions)
    await knex.schema.createTable("games", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("creator_id").references("id").inTable("users").onDelete("CASCADE");
        table.uuid("word_pair_id").references("id").inTable("word_pairs");
        table.uuid("minority_user_id").references("id").inTable("users");
        table.string("majority_word"); // Set when game starts
        table.string("minority_word"); // Set when game starts
        table.string("status").defaultTo("Waiting"); // Waiting, Active, Voting, Completed
        table.datetime("started_at");
        table.datetime("ended_at");
        table.timestamps(true, true);
    });

    // Game Players (Connection between users and active games)
    await knex.schema.createTable("game_players", (table) => {
        table.uuid("game_id").references("id").inTable("games").onDelete("CASCADE");
        table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.string("assigned_word"); // The word the player actually sees
        table.string("role"); // Majority, Minority
        table.primary(["game_id", "user_id"]);
        table.timestamps(true, true);
    });

    // Votes table
    await knex.schema.createTable("votes", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("game_id").references("id").inTable("games").onDelete("CASCADE");
        table.uuid("voter_id").references("id").inTable("users");
        table.uuid("voted_id").references("id").inTable("users");
        table.unique(["game_id", "voter_id"]);
        table.timestamps(true, true);
    });

    // Game History table
    await knex.schema.createTable("game_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("game_id").notNullable();
        table.uuid("user_id").references("id").inTable("users");
        table.string("result"); // Winner, Loser
        table.integer("score_earned").defaultTo(0);
        table.jsonb("details"); // Metadata about the game at that state
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("game_history");
    await knex.schema.dropTableIfExists("votes");
    await knex.schema.dropTableIfExists("game_players");
    await knex.schema.dropTableIfExists("games");
    await knex.schema.dropTableIfExists("word_pairs");
    await knex.schema.dropTableIfExists("users");
}
