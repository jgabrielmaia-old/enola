import * as Knex from "knex";
import * as faker from "faker";
import { config } from "../../app";
import { dateToInt } from "../../utils/Utils";

export async function seed(knex: Knex): Promise<any> {
  const fakeEventLogs = [];
  const desiredEventLogs = 10;

  for (let index = 0; index < desiredEventLogs; index++) {
    fakeEventLogs.push(createFakeEventLog(index));
  }

  await knex(config.eventLog).insert(fakeEventLogs);
}

const eventName = () =>
  `${faker.random.arrayElement(["The", ""])} ${capitalizeFirstLetter(faker.company.bsAdjective())} ${faker.music.genre()} ${faker.random.arrayElement(["Concert", "Show", "Tour", "Spectacle", "Rave", "Experience", "Live"])}`.trim();

const capitalizeFirstLetter = (str: String) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const createFakeEventLog = (id: number) => ({
  [`${config.character}_id`]: id,
  event_name: eventName(),
  event_date: dateToInt(faker.date.past()),
});
