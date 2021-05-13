import * as faker from "faker";

export const random_time = () => faker.datatype.number({ min: 900, max: 1800 });

export const random_training_time = () =>
  faker.datatype.number({ min: 45, max: 180 });

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

const pad = (n: Number) => {
  let numberString = n.toString();
  return numberString.length >= 2
    ? n
    : new Array(2 - numberString.length + 1).join("0") + n;
};
