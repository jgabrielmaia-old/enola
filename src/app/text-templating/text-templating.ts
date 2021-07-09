import * as faker from "faker";
import { eventName } from "../../utils/utils";
import { addContextAttribute } from "../context-handler/context-handler";
import { ITemplate } from "../interfaces/itemplate";
import { schemaConfig } from "../schema/schema";
import { load } from "../state-management";
import { referenceDate, pastDate } from "./dateHandler";
import { partial } from "./partial";
import { switcher } from "./switcher";

export const shadowTargetProperties : any[] = []

export const textTemplating = (): any[] => {
  const templates: ITemplate[] = load(process.cwd() + `/conf/quotes.json`);
  const quotes : any[] = [];

  for (let index = 0; index < templates.length; index++) {
    let quote = templates[index].base_quote;
    const name = templates[index].name;
    if(!templates[index].entities)
      continue;
    
    const entities = templates[index].entities;

    for (let entity of entities) {
      let element : any;

      if (entity.options) {
        element = faker.random.arrayElement(entity.options);
      }
      else if (entity.partial) {
        const partialObject = partial(entity.partial);
        const property = entity.partial.split(".")[1].toLowerCase();
        element = partialObject[property];
        shadowTargetProperties.push({quote: templates[index].name, ...entity, element});
        addContextAttribute(templates[index].name, entity, partialObject);
      }
      else {
        element = whichElement(entity);    
      }
      
      if(entity.context && !entity.partial) { 
        addContextAttribute(templates[index].name, entity, element)
      };

      if((templates[index].name == "source_2_dialog" || templates[index].name == "target_1_dialog") && !entity.partial && entity.context)
      {
        shadowTargetProperties.push({quote: templates[index].name, ...entity, element});
      }

      quote = quote.replace(`{${entity.name}}`, element);
    }

    quotes[index] = {quote, name};
  }

  return quotes;
};

const whichElement = (entity: any): any => {
  if (entity.switcher) {
    const [switcherName, caseProperty] = entity.switcher.split('.');
    return switcher(switcherName, caseProperty);
  }
  else {
    let element : any;
    switch (entity.type) {
      case "streetname":
        element = faker.address.streetName();
        break;
      case "name":
        element = `${faker.name.firstName()} ${faker.name.lastName()}`;
        break;
      case "pastDate":
        element = pastDate();
        break;
      case "referenceDate":
        element = referenceDate();
        break;  
      case "companyName":
        element = faker.name.firstName();
        break;
      case "place":
        element = schemaConfig.club;
        break;
      case "city":
        element = faker.address.city();
        break;
      case "event":
        element = eventName();
        break;
      case "year":
        element = (new Date().getFullYear() - 1).toString();
        break;
      case "hairColor":
        element = (new Date().getFullYear() - 1).toString();
        break;
      case "car":
        element = `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`;
        break;
      case "low_height":
        element = faker.datatype.number({ min: 163, max: 168 }).toString();
        break;
      case "high_height":
        element = faker.datatype.number({ min: 171, max: 178 }).toString();
        break;
    }

    return element;
  }
}