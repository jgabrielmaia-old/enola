import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";

export async function seed(knex: Knex): Promise<any> {
  const fakeCharacters = [];
  const desiredCharacters = 10;
  
  for (let index = 0; index < desiredCharacters; index++) {
    fakeCharacters.push(createFakeCharacter(index));
  }

  await knex(config.character).insert(fakeCharacters);
}

const createFakeCharacter = (id: number) => ({
  name: faker.fake("{{name.firstName}} {{name.lastName}}"),
  [`${config.license}_id`]: id,
  address_number: faker.datatype.number({ min: 1, max: 2000 }),
  address_street_name: faker.address.streetName(),
  ssn: faker.phone.phoneNumber("#########"),
});
