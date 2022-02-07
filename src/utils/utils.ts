import * as faker from "faker";

export const randomTime = (hour?:string) => {
  const dateTime = faker.datatype.datetime();
  const newHour = pad(hour ? Number.parseInt(hour) : dateTime.getHours());
  return `${newHour}${pad(dateTime.getMinutes())}`
}

export const randomTrainingTime = () =>
  faker.datatype.number({ min: 1, max: 59 });

export const randomGender = () => faker.random.arrayElement(["male", "female"]);

export const whichGender = (nameGender: string): number => {

  let genders = {
    "male": 0,
    "man": 0,
    "female":1,
    "woman": 1
  }

  return genders[nameGender];

}

export const eventName = () =>
  `${faker.random.arrayElement(["The", ""])} ${capitalizeFirstLetter(
    faker.company.bsAdjective()
  )} ${faker.music.genre()} ${faker.random.arrayElement([
    "Concert",
    "Show",
    "Tour",
    "Spectacle",
    "Rave",
    "Experience",
    "Live",
  ])}`.trim();

export const dateToInt = (date: Date) =>
  `${date.getFullYear()}` +
  `${pad(date.getMonth())}` +
  `${pad(date.getDate())}`;

const capitalizeFirstLetter = (str: String) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const pad = (n: Number) => {
  let numberString = n.toString();
  return numberString.length >= 2
    ? n
    : new Array(2 - numberString.length + 1).join("0") + n;
};

export const plateNumber = () => faker.random.alphaNumeric(9).toUpperCase();

export const membershipNumber = () => faker.random.alphaNumeric(8).toUpperCase();

export const defineHeight = (low_height: number, high_height: number) => {
  return faker.datatype.number({min:low_height, max:high_height});
}

export const createDate = (year: string) =>  {
  return +`${year}${pad(faker.datatype.number({min: 1, max: 12}))}${pad(faker.datatype.number({min: 1, max: 28}))}`
}

export const createEventDates = (year: string) => {
  return [
      createDate(year),
      createDate(year),
      createDate(year)
  ]
}

export const whichAmount = (val: string) => {

  let values = {
    "plenty of bills to pay": faker.datatype.number({min:12000, max:30000}),
    "lots of money": faker.datatype.number({min:80000, max:500000})
  }

  return values[val];

}