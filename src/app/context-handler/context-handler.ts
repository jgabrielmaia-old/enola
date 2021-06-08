import faker from "faker";
import { dateToInt, pad } from "../../utils/utils";
import { IContext } from "../interfaces/icontext"

export const consolidateContextAttributes = (contextAttributes:IContext[]) => {
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
    let element: any;
    switch (type) {
        case "date":
        case "check_in_date":
            return transformDateToInt(val);
        case "address_number":
            return `${val}.${whichAddressNumber(val)}`;
        case "amount":
            return whichAmount(val);
        case "eventDates":
            return createEventDates(val);
        default:
            element = val;
            break;
    }

    return element;
}
function transformDateToInt(evaluate: string) {
    const month = evaluate.substring(0, 3);
    const commaIndex = evaluate.indexOf(",");
    const day = evaluate.substring(4, commaIndex);
    const year = evaluate.substring(commaIndex + 2,commaIndex + 6);
    return dateToInt(new Date(+year, whichMonth(month),+day));
}

function whichMonth(month: string): number {
    switch (month) {
        case 'Jan': 
            return 1;
        case 'Fev': 
            return 2;
        case 'Mar': 
            return 3;
        case 'Apr': 
            return 4;
        case 'May': 
            return 5;
        case 'Jun': 
            return 6;
        case 'Jul': 
            return 7;
        case 'Aug': 
            return 8;
        case 'Sep': 
            return 9;
        case 'Oct': 
            return 10;
        case 'Nov': 
            return 11;
        case 'Dec': 
            return 12;
        default:
            return 0;
    };
}

function whichAddressNumber(val: string) {
    switch (val) {
        case "first":
            return faker.datatype.number({min:1, max:5});
        case "last":
            return faker.datatype.number({min:100, max:2000});
        default:
            break;
    }
}


function whichAmount(val: string) {
    switch (val) {
        case "plenty of bills to pay":
            return faker.datatype.number({min:12000, max:30000});
        case "lots of money":
            return faker.datatype.number({min:80000, max:500000});
        default:
            break;
    }
}

function createEventDates(year: string) {
    return [
        createDate(year),
        createDate(year),
        createDate(year)
    ]
}

function createDate(year: string) {
    return +`${year}${pad(faker.datatype.number({min: 1, max: 12}))}${pad(faker.datatype.number({min: 1, max: 28}))}`
}

function defineHeight(low_height: number, high_height: number) {
    return faker.datatype.number({min:low_height, max:high_height});
}

