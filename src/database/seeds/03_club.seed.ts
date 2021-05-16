import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createClubMembership } from "../../utils/fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeClubMemberships = [];
  const desiredClubs = schemaConfig.generation;

  for (let index = 1; index <= desiredClubs; index++) {
    fakeClubMemberships.push(createClubMembership(index));
  }

  await knex(schemaConfig.club).insert(fakeClubMemberships);
}
