import * as Knex from "knex";
import { config } from "../../app";
import { createClub } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeClubs = [];
  const desiredClubs = config.generation;

  for (let index = 1; index <= desiredClubs; index++) {
    fakeClubs.push(createClub(index));
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
