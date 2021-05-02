import * as Knex from "knex";
import { config } from "../../app";
import { createCharacter } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeCharacters = [];
  const desiredCharacters = config.generation;

  for (let index = 1; index <= desiredCharacters; index++) {
    fakeCharacters.push(createCharacter(index));
  }

  const groupedFake = fakeCharacters.reduce((accumulator, currentElem, index) => {
    const insertGroup = Math.floor(index / 10) + 1;
    accumulator[insertGroup] = accumulator[insertGroup] || [];
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
