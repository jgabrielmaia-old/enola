import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";

export async function seed(knex: Knex): Promise<any> {
  const fakeRankings = [];
  const desiredRankings = 10;

  for (let index = 0; index < desiredRankings; index++) {
    fakeRankings.push(createFakeRanking());
  }

  await knex(config.ranking).insert(fakeRankings);
}

const createFakeRanking = () => ({
  ssn: faker.phone.phoneNumber('#########'),
  annual_income: faker.datatype.number({ min: 25000, max: 390000 }),
});
