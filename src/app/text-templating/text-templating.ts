import * as faker from "faker";
import { eventName } from "../../utils/utils";
import { IContext } from "../interfaces/icontext";
import { IEntity } from "../interfaces/ientity";
import { ITemplate } from "../interfaces/itemplate";
import { schemaConfig } from "../schema/schema";
import { load } from "../state-management";
import { referenceDate, witnessDate } from "./dateHandler";
import { partial } from "./partial";
import { switcher } from "./switcher";

export const textTemplating = (contextAttributes: IContext[]): Array<string> => {
  const templates: ITemplate[] = load(process.cwd() + `/conf/quotes.json`);
  const quotes = Array<any>();

  for (let index = 0; index < templates.length; index++) {
    let quote = templates[index].base_quote;
    const name = templates[index].name;
    const entities = templates[index].entities;

    for (let entity of entities) {
      let element : any;

      if (entity.options) {
        element = faker.random.arrayElement(entity.options);
      } else {
        element = whichElement(entity, quote);    
      }
      
      if(entity.context) {
        addAttributes(templates[index].name, entity, element, contextAttributes);
      }
      
      quote = quote.replace(`{${entity.name}}`, element);
    }

    quotes[index] = {quote, name};
  }

  return quotes;
};

const whichElement = (entity: any, quote: string): string => {
  if (entity.switcher) {
    const [switcherName, caseProperty] = entity.switcher.split('.');
    return switcher(switcherName, caseProperty);
  }
  else if (entity.partial) {
    const [partialName, partialProperty] = entity.partial.split('.');
    const partialInfo = partial(partialName);

    return whichPartialInfo(partialInfo, partialProperty);

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
      case "witnessDate":
        element = witnessDate();
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
        element =  `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`;
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

function addAttributes(name: string, entity: IEntity, element: string, contextAttributes: IContext[]) {
  if(entity.name == "CAR"){
    const [carName,carManufacturer] = element.split(" ");
    
    contextAttributes.push({
      context: `${entity.context}_name`,
      element: carName,
      name
    }),

    contextAttributes.push({
      context: `${entity.context}_manufacturer`,
      element: carManufacturer,
      name
    })
  }
  
  else{
    contextAttributes.push({
      context: entity.context,
      element,
      name
    })
  }
}

function whichPartialInfo(partialInfo: any, partialProperty: string): string {
  switch (partialProperty) {
    case "REFERENCE":
      return partialInfo.reference;
    case "VALUE":
      return partialInfo.chopped;
  }
}

