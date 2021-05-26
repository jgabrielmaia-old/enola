import { createCharacter, createLicense, createClubMembership, createClubCheckins } from "../utils/fake";
import { insert } from "./repository/repository";
import { schemaConfig } from "./schema/schema";
import { textTemplating } from "./text-templating/text-templating";

export const gamefy = () => {
  return textTemplating();
};

const makeSourceCharacter: any = async () => {
  const licenseId = await insert(createLicense(), schemaConfig.license);
  const character = createCharacter(licenseId);
  const characterId = await insert(character, schemaConfig.character);
  await insert(createClubMembership(characterId), schemaConfig.clubMembership);
  await insert(createClubCheckins(characterId), schemaConfig.clubCheckin);
  return character;
}

function makeTargetCharacter() {
  throw new Error("Function not implemented.");
}
