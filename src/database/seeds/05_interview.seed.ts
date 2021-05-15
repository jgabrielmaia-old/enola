import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createInterview } from "../../utils/Fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeInterviews = [];
  const desiredCharacters = schemaConfig.generation;

  for (let index = 1; index <= desiredCharacters; index++) {
    fakeInterviews.push(createInterview(index));
  }

  await knex(schemaConfig.interview).insert(fakeInterviews);
}
