import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createClubCheckins } from "../../utils/Fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeClubCheckins = [];
  const desiredClubCheckins = schemaConfig.generation;

  for (let index = 1; index <= desiredClubCheckins; index++) {
    fakeClubCheckins.push(createClubCheckins(index));
  }

  await knex(schemaConfig.clubCheckin).insert(fakeClubCheckins);
}
