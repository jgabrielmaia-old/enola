import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createClub } from "../../utils/Fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeClubs = [];
  const desiredClubs = schemaConfig.generation;

  for (let index = 1; index <= desiredClubs; index++) {
    fakeClubs.push(createClub(index));
  }

  const groupedFake = fakeClubs.reduce((accumulator, currentElem, index) => {
    const insertGroup = Math.floor(index / 10) + 1;
    accumulator[insertGroup] = accumulator[insertGroup] || [];
    accumulator[insertGroup].push(currentElem);
    return accumulator;
  }, []);

  groupedFake.forEach((element: any) => {
    knex
      .transaction((trx) => {
        knex(schemaConfig.club)
          .transacting(trx)
          .insert(element)
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((err) => console.error(err));
  });
}
