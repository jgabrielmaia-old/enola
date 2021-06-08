import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createDialog } from "../../utils/fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeDialogs = [];
  const desiredCharacters = schemaConfig.generation;

  for (let index = 1; index <= desiredCharacters; index++) {
    fakeDialogs.push(createDialog(index));
  }

  await knex(schemaConfig.dialog).insert(fakeDialogs);
}
