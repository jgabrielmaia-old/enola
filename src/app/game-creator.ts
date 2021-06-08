import faker from "faker";
import connection from "../database/connection";
import { createCharacter, createLicense, createClubCheckins, createClubCheckin } from "../utils/fake";
import { pad, random_time } from "../utils/utils";
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
  
  const sourcesAttributes = consolidatedContextAttributes.filter(c => c.name == schemaConfig.scenario);

  const neighborhood = sourcesAttributes.filter(s => s.collumn == "address_street_name")[0].value;
  const sourceOneId = await makeCharacter({
    address_number: sourcesAttributes.find(s => s.collumn == "address_number").value,
    address_street_name: neighborhood
  });

  const sourceTwoId = await makeCharacter({
    name: sourcesAttributes.find(s => s.collumn == "name").value,
    address_street_name: sourcesAttributes.filter(s => s.collumn == "address_street_name")[1].value
  });

  const dialogSourceOneId = await makeDialog(
    sourceOneId,
    quotes.find(q => q.name == "source_1_dialog").quote
  );

  const checkInDate = consolidatedContextAttributes.find(c => c.collumn == "check_in_date").value;

  await makeClubCheckinLog(sourceOneId, checkInDate);

  const dialogSourceTwoId = await makeDialog(
    sourceTwoId,
    quotes.find(q => q.name == "source_2_dialog").quote
  );

  const game = {
    challenge: await connection.table("challenge").where({"id": challengeId}).select("*").first(),
    [`${schemaConfig.scenario}`]: await connection.table(schemaConfig.scenario).where({"id": scenarioId}).select("*").first(),
    sources: [
      await connection.table(schemaConfig.character).where({"id": sourceOneId}).select("*").first(),
      await connection.table(schemaConfig.character).where({"id": sourceTwoId}).select("*").first(),
    ],
    dialogs: [
      await connection.table(schemaConfig.dialog).where({"id": dialogSourceOneId}).select("*").first(),
      await connection.table(schemaConfig.dialog).where({"id": dialogSourceTwoId}).select("*").first(),
    ],
    clubLog: [
      await connection.table(schemaConfig.clubCheckin).where({"check_in_date": checkInDate}).select("*")
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

const makeCharacter = async (additionalProperties?:any) => {
  
  let toInsert = {};
  const licenseId = await insert(createLicense(), schemaConfig.license);

  if(additionalProperties){
    if(additionalProperties.address_number && <string>additionalProperties.address_number.includes('.')){
      const [street_position, street_number] = additionalProperties.address_number.split('.');
      additionalProperties = {...additionalProperties, address_number: street_number};
  
      makeNeighboors(street_position, street_number, additionalProperties.address_street_name);
    }

    toInsert = {...createCharacter(licenseId), ...additionalProperties};
  } 
  else {
    toInsert = createCharacter(licenseId);
  }

  const characterId = await insert(toInsert, schemaConfig.character);
  return characterId;
}

const makeNeighboors = async (val: string, street_number:number, street_name: string) => {
  switch (val) {
      case "first":
          await makeNeighborCharacters(`gt`, street_number, street_name);
          break;
      case "last":
          await makeNeighborCharacters(`lt`, street_number, street_name);
          break;
      default:
          break;
  }
}

const makeNeighborCharacters = async (reference: string, street_number: number, street_name: string) => {
  let begin:number;
  let end:number;

  switch (reference) {
    case "gt":
      begin =  street_number; 
      end = 1000;
      break;
    case "lt":
      begin =  0; 
      end = street_number;
      break;
    default:
        break;
  }

  for (let i = 0; i < 15; i++) {
    await makeCharacter({ 
      address_number: faker.datatype.number({min: begin, max: end}).toString(), 
      address_street_name: street_name
    });
  };
}

const makeDialog = async(id: number, quote: string) => await insert({[`${schemaConfig.character}_id`]: id, transcript: quote}, schemaConfig.dialog);

const makeClubCheckinLog = async(id: number, checkInDate: number) => {
  const clubCheckins =  createClubCheckins(id);
  await insert(clubCheckins, schemaConfig.clubCheckin);
  const checkIn = {...createClubCheckin(id), check_in_date: checkInDate};

  for (let i = 0; i < 10; i++) {
    
    const memberId = await makeCharacter();
    
    const checkin_hour = checkIn.check_in_time.toString().substring(0,2);
    const checkout_hour = pad(+checkIn.check_out_time.toString().substring(0,2) + 1);
    const memberCheckInTime = random_time(checkin_hour);
    const memberCheckoutTime = random_time(checkout_hour.toString());

    const memberCheckIn = {
      [`${schemaConfig.clubMembership}_id`]: memberId,
      check_in_date: checkInDate,
      check_in_time: memberCheckInTime,
      check_out_time: memberCheckoutTime,
    };

    await insert(memberCheckIn, schemaConfig.clubCheckin)   
  }

  return await insert(checkIn, schemaConfig.clubCheckin);
}