import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";
import { dateToInt } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeClubs = [];
  const desiredClubs = 10;

  for (let index = 0; index < desiredClubs; index++) {
    fakeClubs.push(createFakeClub(index));
  }

  await knex(config.club).insert(fakeClubs);
}

const createFakeClub = (id: number) => ({
  [`${config.character}_id`]: id,
  name: faker.company.companyName(),
  membership_start_date: dateToInt(faker.date.past()),
  membership_status: faker.random.arrayElement(["active", "inactive","gold","platinum"]),
});
