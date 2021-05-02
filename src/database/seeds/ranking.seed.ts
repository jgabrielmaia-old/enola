import * as Knex from "knex";
import { config } from "../../app";
import { createRanking } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeRankings = [];
  const desiredRankings = 10;

  for (let index = 0; index < desiredRankings; index++) {
    fakeRankings.push(createRanking());
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

