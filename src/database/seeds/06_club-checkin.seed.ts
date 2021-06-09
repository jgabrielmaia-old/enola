import faker from "faker";
import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createClubCheckins } from "../../utils/fake";

export async function seed(knex: Knex): Promise<any> {
  const desiredClubCheckins = schemaConfig.generation;

  for (let i = 1; i <= desiredClubCheckins; i++) {
    await knex(schemaConfig.clubCheckin).insert(createClubCheckins(faker.random.alphaNumeric(8).toUpperCase()));
  }
}
