import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";

export async function seed(knex: Knex): Promise<any> {
  const fakeCharacters = [];
  const desiredCharacters = config.generation;

  for (let index = 1; index <= desiredCharacters; index++) {
    fakeCharacters.push(createFakeCharacter(index));
  }

  const groupedFake = fakeCharacters.reduce((accumulator, currentElem, index) => {
    const insertGroup = Math.floor(index / 10) + 1;
    accumulator[insertGroup] = accumulator[insertGroup] || []
    accumulator[insertGroup].push(currentElem);
    return accumulator;
  }, []);

  groupedFake.forEach((element: any) => {
    knex.transaction((trx) => {
      knex(config.character)
      .transacting(trx)
      .insert(element)
      .then(trx.commit)
      .catch(trx.rollback);
    })
    .catch((err) => console.error(err));
  });
}

const createFakeCharacter = (id: number) => ({
  name: faker.fake("{{name.firstName}} {{name.lastName}}"),
  [`${config.license}_id`]: id,
  address_number: faker.datatype.number({ min: 1, max: 2000 }),
  address_street_name: faker.address.streetName(),
  ssn: faker.phone.phoneNumber("#########"),
});
