import * as Knex from "knex";

export const save = (entity: unknown, table: any, knex: Knex) => {
    knex.table(table).insert(entity);
}