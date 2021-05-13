import * as faker from "faker";
import { ITemplate } from "../interfaces/itemplate";
import { load } from "../state-management";

export const textTemplating = (schema: string): Array<string> => {
  const templates: ITemplate[] = load(schema);
  const quotes = Array<string>();

  for (let index = 0; index < templates.length; index++) {
    let quote = templates[index].base_quote;
    const entities = templates[index].entities;

    for (let entity of entities) {
      const option = faker.random.arrayElement(entity.options);
      quote = quote.replace(`{${entity.name}}`, option);
    }

    quotes[index] = quote;
  }

  return quotes;
};
