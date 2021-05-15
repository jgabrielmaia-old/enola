import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createEventLog } from "../../utils/Fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeEventLogs = [];
  const desiredEventLogs = schemaConfig.generation;

  for (let index = 1; index <= desiredEventLogs; index++) {
    fakeEventLogs.push(createEventLog(index));
  }

  await knex(schemaConfig.eventLog).insert(fakeEventLogs);
}
