import { createCharacter, createLicense, createClubMembership, createClubCheckins } from "../utils/fake";
import { insert } from "./repository/repository";
import { schemaConfig } from "./schema/schema";
import { load } from "./state-management";
import { textTemplating } from "./text-templating/text-templating";

export const gamefy = async () => {
  console.log(textTemplating(__dirname + "/../../conf/templates/template_sample.json"))
};

const makeSourceCharacter: any = async () => {
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
