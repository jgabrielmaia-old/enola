import * as faker from "faker";
import { eventName } from "../../utils/utils";
import { ITemplate } from "../interfaces/itemplate";
import { schemaConfig } from "../schema/schema";
import { load } from "../state-management";
import { switcher } from "./switcher";

export const textTemplating = (): Array<string> => {
  const templates: ITemplate[] = load(process.cwd() + `/conf/templates/quotes.json`);
  const quotes = Array<string>();

  for (let index = 0; index < templates.length; index++) {
    let quote = templates[index].base_quote;
    const entities = templates[index].entities;

    for (let entity of entities) {

      if (entity.options) {
        quote = quote.replace(`{${entity.name}}`, faker.random.arrayElement(entity.options));
      } else {
        quote = transformQuote(entity, quote);
      }
    }

    quotes[index] = quote;
  }

  return quotes;
};

const transformQuote = (entity: any, quote: string): string => {
  if (entity.switcher) {
    const [switcherName, caseProperty] = entity.switcher.split('.');
    quote = quote.replace(`{${entity.name}}`, switcher(switcherName, caseProperty));
  }
  else {
    switch (entity.type) {
      case "streetname":
        quote = quote.replace(`{${entity.name}}`, faker.address.streetName());
      case "name":
        quote = quote.replace(`{${entity.name}}`, `${faker.name.firstName()} ${faker.name.lastName()}`);
      case "monthDay":
        quote = quote.replace(`{${entity.name}}`, `${faker.date.month({ abbr: true })} ${faker.datatype.number({ min: 1, max: 28 })}`);
      case "companyName":
        quote = quote.replace(`{${entity.name}}`, `${faker.name.firstName()}`);
      case "place":
        quote = quote.replace(`{${entity.name}}`, schemaConfig.club);
      case "city":
        quote = quote.replace(`{${entity.name}}`, faker.address.city());
      case "event":
        quote = quote.replace(`{${entity.name}}`, eventName());
      case "year":
        quote = quote.replace(`{${entity.name}}`, (new Date().getFullYear() - 1).toString());
      case "hairColor":
        quote = quote.replace(`{${entity.name}}`, (new Date().getFullYear() - 1).toString());
      case "car":
        quote = quote.replace(`{${entity.name}}`, faker.vehicle.vehicle());
      case "low_height":
        quote = quote.replace(`{${entity.name}}`, faker.datatype.number({ min: 150, max: 160 }).toString());
      case "high_height":
        quote = quote.replace(`{${entity.name}}`, faker.datatype.number({ min: 170, max: 190 }).toString());

    }
  }

  return quote;
}