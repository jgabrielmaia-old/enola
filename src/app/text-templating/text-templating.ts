import * as faker from "faker";
import { ITemplate } from "../interfaces/itemplate";
import { load } from "../state-management";

export const textTemplating = (template: string): Array<string> => {
  const templates: ITemplate[] = load(template);
  const quotes = Array<string>();

  for (let index = 0; index < templates.length; index++) {
    let quote = templates[index].base_quote;
    const entities = templates[index].entities;

    for (let entity of entities) {

      if (entity.options) {
        quote = quote.replace(`{${entity.name}}`, faker.random.arrayElement(entity.options));
      } else {
        quote = transformQuote(entity.type, entity.name, quote);
      }
    }

    quotes[index] = quote;
  }

  return quotes;
};

const transformQuote = (type: string, property: string, quote: string): string => {
  switch (type) {
    case "streetname":
      quote = quote.replace(`{${property}}`, faker.address.streetName());
    case "name":
      quote = quote.replace(`{${property}}`, `${faker.name.firstName()} ${faker.name.lastName()}`);
    case "monthDay":
      quote = quote.replace(`{${property}}`, `${faker.date.month({ abbr: true })} ${faker.datatype.number({ min: 1, max: 28 })}`);
    case "companyName":
      quote = quote.replace(`{${property}}`, `${faker.name.firstName()}`);
  }

  return quote;
}