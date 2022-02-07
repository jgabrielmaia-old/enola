import faker from "faker";
import { createEventDates, dateToInt, defineHeight, pad, whichAmount } from "../../utils/utils";
import { IContext } from "../interfaces/icontext"
import { IEntity } from "../interfaces/ientity";

export const contextAttributes: IContext[] = [];

export const addContextAttribute = (name: string, entity: IEntity, element: any) =>{
    if(entity.partial){
        if(entity.context){
            contextAttributes.push({
                context: entity.context,
                element: element.original,
                name
              });
        }
    }
    else if(entity.name == "CAR"){
        const [carName,carManufacturer] = element.split(" ");
        
        contextAttributes.push({
            context: `${entity.context}_model`,
            element: carName,
            name
        }),

        contextAttributes.push({
            context: `${entity.context}_maker`,
            element: carManufacturer,
            name
        })
    }
    else {
        contextAttributes.push({
          context: entity.context,
          element,
          name
        });
    }
}

export const consolidateContextAttributes = () => {
    const context: any[] = [];
    let low_height : number = 0, high_height: number = 0, height_quote_name: string;
    for (const contextAttribute of contextAttributes) {
        const [table, collumn] = contextAttribute.context.split('.');

        if(collumn == "low_height"){
            low_height = +contextAttribute.element;
            height_quote_name = contextAttribute.name;
        }

        if(collumn == "high_height"){
            high_height = +contextAttribute.element;
        }

        if(low_height > 0 && high_height > 0){
            const height = defineHeight(low_height, high_height);
            context.push({name: height_quote_name, table, collumn: "height", value: height});
        }

        if(collumn != "low_height" && collumn != "high_height") {
            context.push(
            {
                name: contextAttribute.name, 
                table, 
                collumn, 
                value: whichElement(collumn, contextAttribute.element)
            });
        }
    }

    return context;
}

function whichElement(type: string, val: string) {
    //let element: any;

    let element = {
        "date": transformDateToInt(val),
        "check_in_date":transformDateToInt(val),
        "address_number": `${val}.${whichAddressNumber(val)}`,
        "amount": whichAmount(val),
        "event_dates": createEventDates(val),
        "default": val
    }

    return (element[type] || element["default"]);

}

function transformDateToInt(evaluate: string) {
    const month = evaluate.substring(0, 3);
    const commaIndex = evaluate.indexOf(",");
    const day = evaluate.substring(4, commaIndex);
    const year = evaluate.substring(commaIndex + 2,commaIndex + 6);
    return dateToInt(new Date(+year, whichMonth(month),+day));
}

function whichMonth(month: string): number {

    let months = {
        "Jan": 1,
        "Fev": 2,
        "Mar": 3,
        "Apr": 4,
        "May": 5,
        "Jun": 6,
        "Jul": 7,
        "Aug": 8,
        "Sep": 9,
        "Oct": 10,
        "Nov": 11,
        "Dec": 12,
        "default": 0
    }
    return (months[month] || months["default"]);
}

function whichAddressNumber(val: string) {

    let addres = {
        "first": faker.datatype.number({min:1, max:5}),
        "last": faker.datatype.number({min:100, max:2000})
    }

    return addres[val];
}