import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createCharacter } from "../../utils/fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeCharacters = [];
  const desiredCharacters = schemaConfig.generation;

  for (let index = 1; index <= desiredCharacters; index++) {
    fakeCharacters.push(createCharacter(index));
  }

  await knex(schemaConfig.character).insert(fakeCharacters);
}
