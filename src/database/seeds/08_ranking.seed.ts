import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createRanking } from "../../utils/fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeRankings = [];
  const desiredRankings = schemaConfig.generation;

  for (let index = 0; index < desiredRankings; index++) {
    fakeRankings.push(createRanking());
  }

  await knex(schemaConfig.ranking).insert(fakeRankings);
}
