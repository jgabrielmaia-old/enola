import * as Knex from "knex";
import { config } from "../../app";

export async function seed(knex: Knex): Promise<any> {
  return knex(config.character)
    .del()
    .then(() => {
      return knex(config.character).insert([
        {
          street: "Av. Brasil",
          number: 1586,
          hint: "Do outro lado do Paraibuna",
          neighborhood: "Centro",
          city: "Juiz de Fora",
          uf: "MG",
        },
      ]);
    });
}
