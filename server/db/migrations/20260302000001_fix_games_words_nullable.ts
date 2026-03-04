import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("games", (table) => {
        table.string("majority_word").nullable().alter();
        table.string("minority_word").nullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("games", (table) => {
        table.string("majority_word").notNullable().alter();
        table.string("minority_word").notNullable().alter();
    });
}
