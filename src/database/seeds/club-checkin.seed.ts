import * as Knex from "knex";
import { config } from "../../app";
import { createClubCheckins } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeClubCheckins = [];
  const desiredClubCheckins = config.generation;

  for (let index = 1; index <= desiredClubCheckins; index++) {
    fakeClubCheckins.push(createClubCheckins(index));
  }

  const groupedFake = fakeClubCheckins.reduce((accumulator, currentElem, index) => {
    const insertGroup = Math.floor(index / 10) + 1;
    accumulator[insertGroup] = accumulator[insertGroup] || []
    accumulator[insertGroup].push(currentElem);
    return accumulator;
  }, []);

  groupedFake.forEach((element: any) => {
    knex.transaction((trx) => {
      knex(config.clubCheckin)
        .transacting(trx)
        .insert(element)
        .then(trx.commit)
        .catch(trx.rollback);
    })
      .catch((err) => console.error(err));
  });
}