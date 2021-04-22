import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";

export async function seed(knex: Knex): Promise<any> {
  const fakeInterviews = [];
  const desiredCharacters = 10;

  for (let index = 1; index <= desiredCharacters; index++) {
    fakeInterviews.push(createFakeInterview(index));
  }
   
  const groupedFake = fakeInterviews
    .reduce((accumulator, currentElem, index) => {
      const insertGroup = Math.floor(index / 10) + 1;
      accumulator[insertGroup] = accumulator[insertGroup] || []
      accumulator[insertGroup].push(currentElem);
      return accumulator;
    }, []);

  groupedFake.forEach((element: any) => {
    knex.transaction((trx) => {
      knex(config.interview)
        .transacting(trx)
        .insert(element)
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => console.error(err));
  });
}

const createFakeInterview = (id: number) => ({
  [`${config.character}_id`]: id,
  transcript: faker.lorem.paragraph()
});
