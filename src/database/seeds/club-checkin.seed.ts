import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";
import { dateToInt } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeClubCheckIns = [];
  const desiredClubCheckIns = config.generation;

  for (let index = 1; index <= desiredClubCheckIns; index++) {
    fakeClubCheckIns.push(createFakeClubCheckIns(index));
  }
  
  const groupedFake = fakeClubCheckIns.reduce((accumulator, currentElem, index) => {
    const insertGroup = Math.floor(index / 10) + 1;
    accumulator[insertGroup] = accumulator[insertGroup] || []
    accumulator[insertGroup].push(currentElem);
    return accumulator;
  }, []);

  groupedFake.forEach((element: any) => {
    knex.transaction((trx) => {
      knex(config.clubCheckIn)
      .transacting(trx)
      .insert(element)
      .then(trx.commit)
      .catch(trx.rollback);
    })
    .catch((err) => console.error(err));
  });
}

const random_time = () => faker.datatype.number({ min: 900, max: 1800 });

const random_training_time = () => faker.datatype.number({ min: 45, max: 180 });

const createFakeClubCheckIns = (id: number) => ({
  [`${config.club}_id`]: id,
  check_in_date: dateToInt(faker.date.past()),
  check_in_time: random_time(),
  check_out_time: random_time() + random_training_time(),
});
