import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("games", (table) => {
        table.string("majority_word").nullable().alter();
        table.string("minority_word").nullable().alter();
    });

    await knex.schema.alterTable("votes", (table) => {
        table.unique(["game_id", "voter_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("votes", (table) => {
        table.dropUnique(["game_id", "voter_id"]);
    });

    await knex.schema.alterTable("games", (table) => {
        table.string("majority_word").notNullable().alter();
        table.string("minority_word").notNullable().alter();
    });
}
