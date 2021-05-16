import { createCharacter, createLicense, createClubMembership, createClubCheckins } from "../utils/fake";
import { insert } from "./repository/repository";
import { schemaConfig } from "./schema/schema";

export const gamefy = async () => {
  const villain = await makeTargetCharacter();
  
  const witness_1 = await makeSourceCharacter(); 
  console.log(witness_1);
};

const makeSourceCharacter : any = async () => {
  const licenseId = await insert(createLicense(), schemaConfig.license);
  const character = createCharacter(licenseId);
  const characterId = await insert(character, schemaConfig.character);
  await insert(createClubMembership(characterId), schemaConfig.club);
  await insert(createClubCheckins(characterId), schemaConfig.clubCheckin);
  return character;
}

function makeTargetCharacter() {
  throw new Error("Function not implemented.");
}
