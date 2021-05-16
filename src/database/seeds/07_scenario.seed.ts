import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createScenario } from "../../utils/fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeScenarios = [];
  const desiredScenarios = schemaConfig.generation;

  for (let index = 0; index < desiredScenarios; index++) {
    fakeScenarios.push(createScenario());
  }

  await knex(schemaConfig.scenario).insert(fakeScenarios);
}
