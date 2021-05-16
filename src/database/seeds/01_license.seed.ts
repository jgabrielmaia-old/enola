import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createLicense } from "../../utils/fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeLicenses = [];
  const desiredLicenses = schemaConfig.generation;

  for (let index = 1; index <= desiredLicenses; index++) {
    fakeLicenses.push(createLicense());
  }

  await knex(schemaConfig.license).insert(fakeLicenses);
}
