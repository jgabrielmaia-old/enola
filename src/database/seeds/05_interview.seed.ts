import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createInterview } from "../../utils/Fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeInterviews = [];
  const desiredCharacters = 10;

  for (let index = 1; index <= desiredCharacters; index++) {
    fakeInterviews.push(createInterview(index));
  }

  const groupedFake = fakeInterviews.reduce(
    (accumulator, currentElem, index) => {
      const insertGroup = Math.floor(index / 10) + 1;
      accumulator[insertGroup] = accumulator[insertGroup] || [];
      accumulator[insertGroup].push(currentElem);
      return accumulator;
    },
    []
  );

  groupedFake.forEach((element: any) => {
    knex
      .transaction((trx) => {
        knex(schemaConfig.interview)
          .transacting(trx)
          .insert(element)
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((err) => console.error(err));
  });
}
