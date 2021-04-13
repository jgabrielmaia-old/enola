import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";

export async function seed(knex: Knex): Promise<any> {
  const fakeInterviews = [];
  const desiredCharacters = 10;

  for (let index = 0; index < desiredCharacters; index++) {
    fakeInterviews.push(createFakeInterview(index));
  }

  await knex(config.interview).insert(fakeInterviews);
}

const createFakeInterview = (id: number) => ({
  [`${config.character}_id`]: id,
  transcript: faker.lorem.paragraph()
});
