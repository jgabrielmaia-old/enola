import faker from "faker";
import connection from "../database/connection";
import { createCharacter, createLicense, createClubCheckins, createClubCheckin, createClubMembership, createRanking } from "../utils/fake";
import { pad, randomTime } from "../utils/utils";
import { consolidateContextAttributes } from "./context-handler/context-handler";
import { insert } from "./repository/repository";
import { schemaConfig } from "./schema/schema";
import { textTemplating } from "./text-templating/text-templating";

export const gamefy = async () => { 
  const quotes = textTemplating();

  const challengeId = await makeChallenge(
    quotes.find(q => q.name == "description"));

  const consolidatedContextAttributes = consolidateContextAttributes();

  const scenarioId = await makeScenario(
    quotes.find(q => q.name == schemaConfig.scenario), 
    consolidatedContextAttributes.filter(c => c.name == "description"));
  
  const sourcesAttributes = consolidatedContextAttributes.filter(c => c.name == schemaConfig.scenario);

  const neighborhood = sourcesAttributes.filter(s => s.collumn == "address_street_name")[0].value;
  const sourceOneId = await makeCharacter(await makeLicense(),
    {
    address_number: sourcesAttributes.find(s => s.collumn == "address_number").value,
    address_street_name: neighborhood
  });

  const sourceTwoId = await makeCharacter(await makeLicense(),
  {
    name: sourcesAttributes.find(s => s.collumn == "name").value,
    address_street_name: sourcesAttributes.filter(s => s.collumn == "address_street_name")[1].value
  });

  const dialogSourceOneId = await makeDialog(
    sourceOneId,
    quotes.find(q => q.name == "source_1_dialog").quote
  );

  const targetOneLicense:any = consolidatedContextAttributes
    .filter(c => c.name == "source_2_dialog" && c.table == "license")
    .map(c => { return {"key": c.collumn, "value": c.value}})
    .reduce((obj,item) => Object.assign(obj, { [item.key]: item.value }), {});

  const targetOneClubMembership = consolidatedContextAttributes
    .filter(c => c.name == "source_2_dialog" && c.table == "clubMembership")
    .map(c => { return {"key": c.collumn, "value": c.value}})
    .reduce((obj,item) => Object.assign(obj, { [item.key]: item.value }), {});

  const targetOneLicenseId = await makeLicense(targetOneLicense);
  const targetOneId = await makeCharacter(targetOneLicenseId, undefined, targetOneLicense.gender);
  const targetOneMembershipId = await makeClubMembership(targetOneId, targetOneClubMembership);

  const sourceOneMembership = await makeClubMembership(sourceOneId);
  const checkInDate = consolidatedContextAttributes.find(c => c.collumn == "check_in_date").value;

  await makeSourceClubCheckinLog(sourceOneMembership, checkInDate, targetOneMembershipId);

  const dialogSourceTwoId = await makeDialog(
    sourceTwoId,
    quotes.find(q => q.name == "source_2_dialog").quote
  );

  const dialogTargetId = await makeDialog(
    targetOneId,
    quotes.find(q => q.name == "target_1_dialog").quote
  )

  const targetTwoLicense:any = consolidatedContextAttributes
  .filter(c => c.name == "target_1_dialog" && c.table == "license")
  .map(c => { return {"key": c.collumn, "value": c.value}})
  .reduce((obj,item) => Object.assign(obj, { [item.key]: item.value }), {});

  const targetTwoRanking:any = consolidatedContextAttributes
  .filter(c => c.name == "target_1_dialog" && c.table == "ranking")
  .map(c => { return {"key": c.collumn, "value": c.value}})
  .reduce((obj,item) => Object.assign(obj, { [item.key]: item.value }), {});

  const targetTwoEventLog:any = consolidatedContextAttributes
  .filter(c => c.name == "target_1_dialog" && c.table == "eventLog")
  .map(c => { return {"key": c.collumn, "value": c.value}})
  .reduce((obj,item) => Object.assign(obj, { [item.key]: item.value }), {});

  const targeTwoLicenseId = await makeLicense(targetTwoLicense);
  const targetTwoId = await makeCharacter(targeTwoLicenseId, undefined, targetTwoLicense.gender);
  const targetTwo = await connection.table(schemaConfig.character).where({id: targetTwoId}).select("*").first(); 

  targetTwoEventLog.event_dates.map((d: number) => {
    return {
      [`${schemaConfig.character}_id`]: targetTwoId,
      event_name: targetTwoEventLog.event_name,
      event_date: d
    }
  }).forEach(async (event: any) => await insert(event, schemaConfig.eventLog));

  const targetTwoRankingEntity = {annual_income: targetTwoRanking.amount, ssn: targetTwo.ssn};
  await insert(targetTwoRankingEntity, schemaConfig.ranking);

  const game = {
    challenge: await connection.table("challenge").where({id: challengeId}).select("*").first(),
    [`${schemaConfig.scenario}`]: await connection.table(schemaConfig.scenario).where({"id": scenarioId}).select("*").first(),
    sources: [
      await connection.table(schemaConfig.character).where({id: sourceOneId}).select("*").first(),
      await connection.table(schemaConfig.character).where({id: sourceTwoId}).select("*").first(),
    ],
    dialogs: [
      await connection.table(schemaConfig.dialog).where({id: dialogSourceOneId}).select("*").first(),
      await connection.table(schemaConfig.dialog).where({id: dialogSourceTwoId}).select("*").first(),
      await connection.table(schemaConfig.dialog).where({id: dialogTargetId}).select("*").first(),
    ],
    target_one: {
      profile: await connection.table(schemaConfig.character).where({id: targetOneId}).select("*"),
      license: await connection.table(schemaConfig.license).where({id: targetOneLicenseId}).select("*"),
      membership: await connection.table(schemaConfig.clubMembership).where({id: targetOneMembershipId}).select("*")
    },
    target_two: {
      profile: await connection.table(schemaConfig.character).where({id: targetTwoId}).select("*"),
      license: await connection.table(schemaConfig.license).where({id: targetOneLicenseId}).select("*"),
      ranking: await connection.table(schemaConfig.ranking).where({ssn: targetTwo.ssn}).select("*"),
      eventLog: await connection.table(schemaConfig.eventLog).where({[`${schemaConfig.character}_id`]: targetTwoId}).select("*")
    }
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

const makeLicense = async(licenseProperties?:any) => {
  if(licenseProperties){
    const license = {...createLicense(), ...licenseProperties};
    return await insert(license, schemaConfig.license);
  }
  
  return await insert(createLicense(), schemaConfig.license);
}

const makeCharacter = async (licenseId:number, characterProperties?:any, nameGender?: string) : Promise<number> => {
  if(characterProperties){
    if(characterProperties.address_number){
      const addressNumber = checkAddressNumber(characterProperties.address_number, characterProperties.address_street_name);
      characterProperties = {...characterProperties, address_number: addressNumber};
    }

    return await insert({...createCharacter(licenseId,nameGender), ...characterProperties}, schemaConfig.character);
  } 

  return await insert(createCharacter(licenseId,nameGender), schemaConfig.character);

}

const checkAddressNumber = (addressNumber: string, addressName: string) => {
  if(addressNumber.includes('.')){
    const [street_position, street_number] = addressNumber.split('.');
    makeNeighboors(street_position, +street_number, addressName);
    return +street_number;
  }
  return +addressNumber;
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
    const licenseId = await makeLicense();
    await makeCharacter(
      licenseId,
      { 
        address_number: faker.datatype.number({min: begin, max: end}).toString(), 
        address_street_name: street_name
      });
  };
}

const makeDialog = async(id: number, quote: string) => await insert({[`${schemaConfig.character}_id`]: id, transcript: quote}, schemaConfig.dialog);

const makeSourceClubCheckinLog = async(sourceMembershipId: string, checkInDate: number, targetMembershipId: string) => {
  
  const sourceClubCheckins =  createClubCheckins(sourceMembershipId);

  await insert(sourceClubCheckins, schemaConfig.clubCheckin)
 
  const sourceTranscriptCheckIn = {...createClubCheckin(sourceMembershipId), check_in_date: checkInDate};
  const targetTranscriptCheckIn = makeRandomTrainerCheckIn(targetMembershipId, sourceTranscriptCheckIn, checkInDate);

  await insert(targetTranscriptCheckIn, schemaConfig.clubCheckin);   

  for (let i = 0; i < 10; i++) {
    const licenseId = await makeLicense();
    const characterId = await makeCharacter(licenseId);
    const membershipId = await makeClubMembership(characterId);
    const randomCheckIn = makeRandomTrainerCheckIn(membershipId, sourceTranscriptCheckIn, checkInDate);

    await insert(randomCheckIn, schemaConfig.clubCheckin);   
  }

  return await insert(sourceTranscriptCheckIn, schemaConfig.clubCheckin);
}

const makeRandomTrainerCheckIn = (randomTrainerId: string, checkIn: any, checkInDate: number) =>{
  const checkin_hour = checkIn.check_in_time.toString().substring(0,2);
  const checkout_hour = pad(+checkIn.check_out_time.toString().substring(0,2) + 1);
  const memberCheckInTime = randomTime(checkin_hour);
  const memberCheckoutTime = randomTime(checkout_hour.toString());

  return {
    [`${schemaConfig.clubMembership}_id`]: randomTrainerId,
    check_in_date: checkInDate,
    check_in_time: memberCheckInTime,
    check_out_time: memberCheckoutTime,
  };
}

const makeClubMembership = async (characterId: number, membershipProperties?: any) => {
  if(membershipProperties){
    await insert({...createClubMembership(characterId), ...membershipProperties}, schemaConfig.clubMembership);    
  }
  await insert(createClubMembership(characterId), schemaConfig.clubMembership);

  const {id} = await connection.table(schemaConfig.clubMembership).where({[`${schemaConfig.character}_id`]: characterId}).select("id").first()
  return id;
}