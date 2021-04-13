import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";
import { dateToInt } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeScenarios = [];
  const desiredScenarios = 10;

  for (let index = 0; index < desiredScenarios; index++) {
    fakeScenarios.push(createFakeScenario());
  }

  await knex(config.scenario).insert(fakeScenarios);
}

const createFakeScenario = () => ({
  date: dateToInt(faker.date.past()),
  description: faker.lorem.paragraph(),
  city: faker.address.city()
});
