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
        "date": function(){
            return transformDateToInt(val);
        },
        "check_in_date": function (){
            return transformDateToInt(val);
        },
        "address_number": function(){
            return `${val}.${whichAddressNumber(val)}`;
        },
        "amount": function(){
            return whichAmount(val);
        },
        "event_dates": function(){
            return createEventDates(val);
        },
        "default": function(){
            return val;
        }
    }
    return (element[type] || element["default"])();

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
        "Jan": function(){
            return 1;
        },
        "Fev": function(){
            return 2;
        },
        "Mar": function(){
            return 3;
        },
        "Apr": function(){
            return 4;
        },
        "May": function(){
            return 5;
        },
        "Jun": function(){
            return 6;
        },
        "Jul": function(){
            return 7;
        },
        "Aug": function(){
            return 8;
        },
        "Sep": function(){
            return 9;
        },
        "Oct": function(){
            return 10;
        },
        "Nov": function(){
            return 11;
        },
        "Dec": function(){
            return 12;
        },
        "default": function(){
            return 0;
        }
    }
    return (months[month] || months["default"])();
}

function whichAddressNumber(val: string) {

    let addres = {
        "first": function(){
            return faker.datatype.number({min:1, max:5});
        },
        "last": function(){
            return faker.datatype.number({min:100, max:2000});
        }
    }

    return addres[val]();
}