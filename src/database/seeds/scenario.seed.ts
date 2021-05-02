import * as Knex from "knex";
import { config } from "../../app";
import { createScenario} from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeScenarios = [];
  const desiredScenarios = config.generation;

  for (let index = 0; index < desiredScenarios; index++) {
    fakeScenarios.push(createScenario());
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
