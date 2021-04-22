import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";
import { dateToInt } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeScenarios = [];
  const desiredScenarios = config.generation;

  for (let index = 0; index < desiredScenarios; index++) {
    fakeScenarios.push(createFakeScenario());
  }

  const groupedFake = fakeScenarios
    .reduce((accumulator, currentElem, index) => {
      const insertGroup = Math.floor(index / 10) + 1;
      accumulator[insertGroup] = accumulator[insertGroup] || []
      accumulator[insertGroup].push(currentElem);
      return accumulator;
    }, []);

  groupedFake.forEach((element: any) => {
    knex.transaction((trx) => {
      knex(config.scenario)
        .transacting(trx)
        .insert(element)
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => console.error(err));
  });
}

const createFakeScenario = () => ({
  date: dateToInt(faker.date.past()),
  description: faker.lorem.paragraph(),
  city: faker.address.city()
});
