import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";

export async function seed(knex: Knex): Promise<any> {
  const fakeLicenses = [];
  const desiredLicenses = 10;
  
  for (let index = 1; index <= desiredLicenses; index++) {
    fakeLicenses.push(createFakeLicense());
  }

  const groupedFake = fakeLicenses
    .reduce((accumulator, currentElem, index) => {
      const insertGroup = Math.floor(index / 10) + 1;
      accumulator[insertGroup] = accumulator[insertGroup] || []
      accumulator[insertGroup].push(currentElem);
      return accumulator;
    }, []);

  groupedFake.forEach((element: any) => {
    knex.transaction((trx) => {
      knex(config.license)
        .transacting(trx)
        .insert(element)
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => console.error(err));
  });
}

const createFakeLicense = () => ({
  age: faker.datatype.number({ min: 16, max: 75 }),
  height: faker.datatype.number({ min: 150, max: 200 }),
  eye_color: faker.random.arrayElement(["amber", "blue", "brown", "gray", "green"]),
  hair_color: faker.random.arrayElement(["red", "black", "brown", "blonde", "white"]),
  gender: faker.random.arrayElement(["male", "female"]),
  plate_number: faker.random.alphaNumeric(9),
  car_maker: faker.vehicle.manufacturer(),
  car_model: faker.vehicle.model()
});
