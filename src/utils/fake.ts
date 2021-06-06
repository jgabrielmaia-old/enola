import * as faker from "faker";
import { schemaConfig } from "../app/schema/schema";
import {
  dateToInt,
  eventName,
  random_time,
  random_training_time,
} from "./utils";

export const createCharacter = (id: number) => ({
  name: faker.fake("{{name.firstName}} {{name.lastName}}"),
  [`${schemaConfig.license}_id`]: id,
  address_number: faker.datatype.number({ min: 1, max: 2000 }),
  address_street_name: faker.address.streetName(),
  ssn: faker.phone.phoneNumber("#########"),
});

export const createClubCheckin = (id: number) => ({
  [`${schemaConfig.clubMembership}_id`]: id,
  check_in_date: dateToInt(faker.date.past()),
  check_in_time: random_time(),
  check_out_time: random_time() + random_training_time(),
});

export const createClubCheckins = (id: number) => {
  const fakeClubCheckins = [];

  for (let i = 0; i < faker.datatype.number({ min: 3, max: 10 }); i++) {
    fakeClubCheckins.push(createClubCheckin(id));
  }

  return fakeClubCheckins;
}

export const createClubMembership = (id: number) => ({
  [`${schemaConfig.character}_id`]: id,
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

export const createInterview = (id: number) => ({
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
  gender: faker.random.arrayElement(["male", "female"]),
  plate_number: faker.random.alphaNumeric(9),
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