import * as faker from "faker";
import { eventName } from "../../utils/utils";
import { addContextAttribute } from "../context-handler/context-handler";
import { ITemplate } from "../interfaces/itemplate";
import { schemaConfig } from "../schema/schema";
import { load } from "../state-management";
import { referenceDate, pastDate } from "./dateHandler";
import { partial } from "./partial";
import { switcher } from "./switcher";

export const shadowTargetProperties: any[] = []

export const textTemplating = (): any[] => {
  const templates: ITemplate[] = load(process.cwd() + `/conf/quotes.json`);
  const quotes: any[] = [];

  for (let index = 0; index < templates.length; index++) {
    let quote = templates[index].base_quote;
    const name = templates[index].name;
    if (!templates[index].entities)
      continue;

    const entities = templates[index].entities;

    for (let entity of entities) {
      let element: any;

      if (entity.options) {
        element = faker.random.arrayElement(entity.options);
      }
      else if (entity.partial) {
        const partialObject = partial(entity.partial);
        const property = entity.partial.split(".")[1].toLowerCase();
        element = partialObject[property];
        shadowTargetProperties.push({ quote: templates[index].name, ...entity, element });
        addContextAttribute(templates[index].name, entity, partialObject);
      }
      else {
        element = whichElement(entity);
      }

      if (entity.context && !entity.partial) {
        addContextAttribute(templates[index].name, entity, element)
      };

      if ((templates[index].name == "source_2_dialog" || templates[index].name == "target_1_dialog") && !entity.partial && entity.context) {
        shadowTargetProperties.push({ quote: templates[index].name, ...entity, element });
      }

      quote = quote.replace(`{${entity.name}}`, element);
    }

    quotes[index] = { quote, name };
  }

  return quotes;
};

const whichElement = (entity: any): any => {
  if (entity.switcher) {
    const [switcherName, caseProperty] = entity.switcher.split('.');
    return switcher(switcherName, caseProperty);
  }
  else {
    let element: any;

    let entityTypes = {
      "streetname": faker.address.streetName(),
      "name": `${faker.name.firstName()} ${faker.name.lastName()}`,
      "pastDate": pastDate(),
      "referenceDate": referenceDate(),
      "companyName": faker.name.firstName(),
      "place": schemaConfig.club,
      "city": faker.address.city(),
      "event": eventName(),
      "year": (new Date().getFullYear() - 1).toString(),
      "hairColor": (new Date().getFullYear() - 1).toString(),
      "car": `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
      "low_height": faker.datatype.number({ min: 163, max: 168 }).toString(),
      "high_height": faker.datatype.number({ min: 171, max: 178 }).toString()
    }
    element = entityTypes[entity.type];
    return element;
  }
}