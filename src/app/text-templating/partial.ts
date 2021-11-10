import faker from "faker";
import { IPartial } from "../interfaces/ipartial";


const partialCache: IPartial[] = [];

export const partial = (entityPartial: string) : IPartial => {
    const partialName = entityPartial.split(".")[0];

    if(partialCache.some(p => p.name == partialName)) {
        const element = partialCache.find(p => p.name == partialName);
        return element;
    }

    const element = createPartial(partialName);
    
    partialCache.push(element);
    
    return element;
}

export const createPartial = (name: string) : IPartial => {

    let names = {
        "MEMBERSHIP": function(){
            return chop(name, faker.random.alphaNumeric(8).toUpperCase());
        },
        "PLATE": function(){
            return(chop(name, faker.random.alphaNumeric(9).toUpperCase()));
        }
    }
    
    return names[name]();

}

export const chop = (name:string, original: string) : IPartial => {
    const reference = faker.random.arrayElement(["starts_with", "ends_with"]);

    let element = {
        "starts_with": function(){
            return {
                name,
                original,
                reference: "starts with",
                value: original.toString().substring(0, 3),
            }; 
        },
        "default": function(){
            return {
                name,
                original,
                reference: "ends with",
                value: original.toString().substring(original.length-3),
            };
        }
    }

    return (element[reference] || element["default"])();
}