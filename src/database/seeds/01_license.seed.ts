import * as Knex from "knex";
import { schemaConfig } from "../../app/schema/schema";
import { createLicense } from "../../utils/Fake";

export async function seed(knex: Knex): Promise<any> {
  const fakeLicenses = [];
  const desiredLicenses = 10;

  for (let index = 1; index <= desiredLicenses; index++) {
    fakeLicenses.push(createLicense());
  }

  console.log(fakeLicenses)

  const groupedFake = fakeLicenses.reduce((accumulator, currentElem, index) => {
    const insertGroup = Math.floor(index / 10) + 1;
    accumulator[insertGroup] = accumulator[insertGroup] || [];
    accumulator[insertGroup].push(currentElem);
    return accumulator;
  }, []);

  groupedFake.forEach((element: any) => {
    knex
      .transaction((trx) => {
        knex(schemaConfig.license)
          .transacting(trx)
          .insert(element)
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((err) => console.error(err));
  });
}
