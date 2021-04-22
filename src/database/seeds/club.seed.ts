import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";
import { dateToInt } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeClubs = [];
  const desiredClubs = config.generation;

  for (let index = 1; index <= desiredClubs; index++) {
    fakeClubs.push(createFakeClub(index));
  }
  
  const groupedFake = fakeClubs.reduce((accumulator, currentElem, index) => {
    const insertGroup = Math.floor(index / 10) + 1;
    accumulator[insertGroup] = accumulator[insertGroup] || []
    accumulator[insertGroup].push(currentElem);
    return accumulator;
  }, []);

  groupedFake.forEach((element: any) => {
    knex.transaction((trx) => {
      knex(config.club)
      .transacting(trx)
      .insert(element)
      .then(trx.commit)
      .catch(trx.rollback);
    })
    .catch((err) => console.error(err));
  });
}

const createFakeClub = (id: number) => ({
  [`${config.character}_id`]: id,
  name: faker.company.companyName(),
  membership_start_date: dateToInt(faker.date.past()),
  membership_status: faker.random.arrayElement(["active", "inactive","gold","platinum"]),
});
