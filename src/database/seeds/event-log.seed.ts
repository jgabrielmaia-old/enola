import * as Knex from "knex";
import { config } from "../../app";
import { createEventLog } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeEventLogs = [];
  const desiredEventLogs = 10;

  for (let index = 1; index <= desiredEventLogs; index++) {
    fakeEventLogs.push(createEventLog(index));
  }

  await knex(config.eventLog).insert(fakeEventLogs);

  const groupedFake = fakeEventLogs.reduce((accumulator, currentElem, index) => {
    const insertGroup = Math.floor(index / 10) + 1;
    accumulator[insertGroup] = accumulator[insertGroup] || []
    accumulator[insertGroup].push(currentElem);
    return accumulator;
  }, []);

  groupedFake.forEach((element: any) => {
    knex.transaction((trx) => {
      knex(config.eventLog)
        .transacting(trx)
        .insert(element)
        .then(trx.commit)
        .catch(trx.rollback);
    })
      .catch((err) => console.error(err));
  });
}
