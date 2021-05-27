import * as faker from "faker";
import { eventName } from "../../utils/utils";
import { ITemplate } from "../interfaces/itemplate";
import { schemaConfig } from "../schema/schema";
import { load } from "../state-management";
import { partial } from "./partial";
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
  else if (entity.partial) {
    const [partialName, partialProperty] = entity.partial.split('.');
    const partialInfo = partial(partialName);

    switch (partialProperty) {
      case "REFERENCE":
        quote = quote.replace(`{${entity.name}}`, partialInfo.reference);
      case "VALUE":
        quote = quote.replace(`{${entity.name}}`, partialInfo.chopped);
    }

  }
  else {
    switch (entity.type) {
      case "streetname":
        quote = quote.replace(`{${entity.name}}`, faker.address.streetName());
        break;
      case "name":
        quote = quote.replace(`{${entity.name}}`, `${faker.name.firstName()} ${faker.name.lastName()}`);
        break;
      case "monthDay":
        quote = quote.replace(`{${entity.name}}`, `${faker.date.month({ abbr: true })} ${faker.datatype.number({ min: 1, max: 28 })}`);
        break;
      case "companyName":
        quote = quote.replace(`{${entity.name}}`, `${faker.name.firstName()}`);
        break;
      case "place":
        quote = quote.replace(`{${entity.name}}`, schemaConfig.club);
        break;
      case "city":
        quote = quote.replace(`{${entity.name}}`, faker.address.city());
        break;
      case "event":
        quote = quote.replace(`{${entity.name}}`, eventName());
        break;
      case "year":
        quote = quote.replace(`{${entity.name}}`, (new Date().getFullYear() - 1).toString());
        break;
      case "hairColor":
        quote = quote.replace(`{${entity.name}}`, (new Date().getFullYear() - 1).toString());
        break;
      case "car":
        quote = quote.replace(`{${entity.name}}`, faker.vehicle.vehicle());
        break;
      case "low_height":
        quote = quote.replace(`{${entity.name}}`, faker.datatype.number({ min: 150, max: 160 }).toString());
        break;
      case "high_height":
        quote = quote.replace(`{${entity.name}}`, faker.datatype.number({ min: 170, max: 190 }).toString());
        break;
    }
  }

  return quote;
}