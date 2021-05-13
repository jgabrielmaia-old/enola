import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createClubCheckins } from "../../utils/Fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeClubCheckins = [];
  const desiredClubCheckins = schemaConfig.generation;

  for (let index = 1; index <= desiredClubCheckins; index++) {
    fakeClubCheckins.push(createClubCheckins(index));
  }

  const groupedFake = fakeClubCheckins.reduce(
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
        knex(schemaConfig.clubCheckin)
          .transacting(trx)
          .insert(element)
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((err) => console.error(err));
  });
}
