import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createClub } from "../../utils/Fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeClubs = [];
  const desiredClubs = schemaConfig.generation;

  for (let index = 1; index <= desiredClubs; index++) {
    fakeClubs.push(createClub(index));
  }

  await knex(schemaConfig.club).insert(fakeClubs);
}
