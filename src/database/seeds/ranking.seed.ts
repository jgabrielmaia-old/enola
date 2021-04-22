import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";

export async function seed(knex: Knex): Promise<any> {
  const fakeRankings = [];
  const desiredRankings = 10;

  for (let index = 0; index < desiredRankings; index++) {
    fakeRankings.push(createFakeRanking());
  }

  const groupedFake = fakeRankings
    .reduce((accumulator, currentElem, index) => {
      const insertGroup = Math.floor(index / 10) + 1;
      accumulator[insertGroup] = accumulator[insertGroup] || []
      accumulator[insertGroup].push(currentElem);
      return accumulator;
    }, []);

  groupedFake.forEach((element: any) => {
    knex.transaction((trx) => {
      knex(config.ranking)
        .transacting(trx)
        .insert(element)
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch((err) => console.error(err));
  });
}

const createFakeRanking = () => ({
  ssn: faker.phone.phoneNumber('#########'),
  annual_income: faker.datatype.number({ min: 25000, max: 390000 }),
});
