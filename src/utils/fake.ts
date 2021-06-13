import * as faker from "faker";
import { schemaConfig } from "../app/schema/schema";
import {
  dateToInt,
  eventName,
  pad,
  randomGender,
  randomTime,
  whichGender,
} from "./utils";

export const createCharacter = (id: number, nameGender?:string) =>
{
  const firstName = nameGender ? faker.name.firstName(whichGender(nameGender)) : faker.name.firstName(whichGender(randomGender()));
  const name = `${firstName} ${faker.name.lastName()}`;

  return {
    name,
    [`${schemaConfig.license}_id`]: id,
    address_number: faker.datatype.number({ min: 1, max: 2000 }),
    address_street_name: faker.address.streetName(),
    ssn: faker.phone.phoneNumber("#########"),
  }
};

export const createClubCheckin = (membershipId: string) => {
  const givenRandomTime = randomTime();
  return {
    [`${schemaConfig.clubMembership}_id`]: membershipId,
    check_in_date: dateToInt(faker.date.past()),
    check_in_time: givenRandomTime,
    check_out_time: randomTime(`${pad(+givenRandomTime.substring(0,2)+1)}`),
  }
};

export const createClubCheckins = (membershipId: string) => {
  const fakeClubCheckins = [];

  for (let i = 0; i < faker.datatype.number({ min: 3, max: 10 }); i++) {
    fakeClubCheckins.push(createClubCheckin(membershipId));
  }

  return fakeClubCheckins;
}

export const createClubMembership = (characterId: number) => ({
  id: faker.random.alphaNumeric(8).toUpperCase(),
  [`${schemaConfig.character}_id`]: characterId,
  membership_start_date: dateToInt(faker.date.past()),
  membership_status: faker.random.arrayElement([
    "active",
    "inactive",
    "gold",
    "platinum",
  ]),
});

export const createEventLog = (id: number) => ({
  [`${schemaConfig.character}_id`]: id,
  event_name: eventName(),
  event_date: dateToInt(faker.date.past()),
});

export const createDialog = (id: number) => ({
  [`${schemaConfig.character}_id`]: id,
  transcript: faker.lorem.paragraph(),
});

export const createLicense = () => ({
  age: faker.datatype.number({ min: 16, max: 75 }),
  height: faker.datatype.number({ min: 150, max: 200 }),
  eye_color: faker.random.arrayElement([
    "amber",
    "blue",
    "brown",
    "gray",
    "green",
    "hazel"
  ]),
  hair_color: faker.random.arrayElement([
    "red",
    "black",
    "brown",
    "blonde",
    "white",
  ]),
  gender: randomGender(),
  plate_number: faker.random.alphaNumeric(9).toUpperCase(),
  car_maker: faker.vehicle.manufacturer(),
  car_model: faker.vehicle.model(),
});

export const createRanking = () => ({
  ssn: faker.phone.phoneNumber("#########"),
  annual_income: faker.datatype.number({ min: 25000, max: 390000 }),
});

export const createScenario = () => ({
  date: dateToInt(faker.date.past()),
  type: faker.hacker.verb(),
  report: faker.lorem.paragraph(),
  city: faker.address.city(),
});