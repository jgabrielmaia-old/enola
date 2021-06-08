import connection from "../database/connection";
import { createCharacter, createLicense, createClubMembership, createClubCheckins } from "../utils/fake";
import { consolidateContextAttributes } from "./context-handler/context-handler";
import { IContext } from "./interfaces/icontext";
import { insert } from "./repository/repository";
import { schemaConfig } from "./schema/schema";
import { textTemplating } from "./text-templating/text-templating";

export const gamefy = async () => {
  const contextAttributes: IContext[] = [];
  const quotes = textTemplating(contextAttributes);
  const consolidatedContextAttributes =  consolidateContextAttributes(contextAttributes);

  const challengeId = await makeChallenge(
    quotes.find(q => q.name == "description"));

  const scenarioId = await makeScenario(
    quotes.find(q => q.name == schemaConfig.scenario), 
    consolidatedContextAttributes.filter(c => c.name == "description"));
  
  const sourceCharactersAttributes = consolidatedContextAttributes.filter(c => c.name == schemaConfig.scenario);

  // to-do create neighbors
  const sourceCharacterOneId = await makeSourceCharacter({
    address_number: sourceCharactersAttributes.find(s => s.collumn == "address_number").value,
    address_street_name: sourceCharactersAttributes.filter(s => s.collumn == "address_street_name")[0].value
  });

  const sourceCharacterTwoId = await makeSourceCharacter({
    name: sourceCharactersAttributes.find(s => s.collumn == "name").value,
    address_street_name: sourceCharactersAttributes.filter(s => s.collumn == "address_street_name")[1].value
  });
  
  const game = {
    challenge: await connection.table("challenge").where({"id": challengeId}).select("*").first(),
    [`${schemaConfig.scenario}`]: await connection.table(schemaConfig.scenario).where({"id": scenarioId}).select("*").first(),
    sourceCharacters: [
      await connection.table(schemaConfig.character).where({"id": sourceCharacterOneId}).select("*").first(),
      await connection.table(schemaConfig.character).where({"id": sourceCharacterTwoId}).select("*").first(),
    ]
  }

  return game;
};

const makeChallenge = async (description: any) => {
  const challenge = {
    description: description.quote,
  }

  return await insert(challenge, "challenge");
}

const makeScenario = async (report: any, descriptionAttributes: any[]) => {
  const scenario = {
    date: descriptionAttributes.find(d => d.collumn == "date").value,
    type: descriptionAttributes.find(d => d.collumn == "type").value,
    city: descriptionAttributes.find(d => d.collumn == "city").value,
    report: report.quote,
  }

  return await insert(scenario, schemaConfig.scenario)
}

const makeSourceCharacter = async (characterProperties:any) => {
  const licenseId = await insert(createLicense(), schemaConfig.license);
  const character = createCharacter(licenseId);
  const characterId = await insert({...character, ...characterProperties}, schemaConfig.character);
  return characterId;
}

function makeTargetCharacter(quote: any, attributes: any[]) {

  throw new Error("Function not implemented.");
}
