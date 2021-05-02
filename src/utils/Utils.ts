import * as faker from "faker";
import { config } from "../app";

export const dateToInt = (date: Date) =>
    `${date.getFullYear()}` +
    `${pad(date.getMonth())}` +
    `${pad(date.getDate())}`;

const pad = (n: Number) => {
    let numberString = n.toString();
    return numberString.length >= 2 ? n : new Array(2 - numberString.length + 1).join("0") + n;
}

export const createCharacter = (id: number) => ({
    name: faker.fake("{{name.firstName}} {{name.lastName}}"),
    [`${config.license}_id`]: id,
    address_number: faker.datatype.number({ min: 1, max: 2000 }),
    address_street_name: faker.address.streetName(),
    ssn: faker.phone.phoneNumber("#########"),
});

const random_time = () => faker.datatype.number({ min: 900, max: 1800 });
const random_training_time = () => faker.datatype.number({ min: 45, max: 180 });

export const createClubCheckins = (id: number) => ({
    [`${config.club}_id`]: id,
    check_in_date: dateToInt(faker.date.past()),
    check_in_time: random_time(),
    check_out_time: random_time() + random_training_time(),
});

export const createClub = (id: number) => ({
    [`${config.character}_id`]: id,
    name: faker.company.companyName(),
    membership_start_date: dateToInt(faker.date.past()),
    membership_status: faker.random.arrayElement(["active", "inactive", "gold", "platinum"]),
});

const capitalizeFirstLetter = (str: String) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const eventName = () =>
    `${faker.random.arrayElement(["The", ""])} ${capitalizeFirstLetter(faker.company.bsAdjective())} ${faker.music.genre()} ${faker.random.arrayElement(["Concert", "Show", "Tour", "Spectacle", "Rave", "Experience", "Live"])}`.trim();

export const createEventLog = (id: number) => ({
    [`${config.character}_id`]: id,
    event_name: eventName(),
    event_date: dateToInt(faker.date.past()),
});

export const createInterview = (id: number) => ({
    [`${config.character}_id`]: id,
    transcript: faker.lorem.paragraph()
});

export const createLicense = () => ({
    age: faker.datatype.number({ min: 16, max: 75 }),
    height: faker.datatype.number({ min: 150, max: 200 }),
    eye_color: faker.random.arrayElement(["amber", "blue", "brown", "gray", "green"]),
    hair_color: faker.random.arrayElement(["red", "black", "brown", "blonde", "white"]),
    gender: faker.random.arrayElement(["male", "female"]),
    plate_number: faker.random.alphaNumeric(9),
    car_maker: faker.vehicle.manufacturer(),
    car_model: faker.vehicle.model()
});

export const createRanking = () => ({
    ssn: faker.phone.phoneNumber('#########'),
    annual_income: faker.datatype.number({ min: 25000, max: 390000 }),
});

export const createScenario = () => ({
    date: dateToInt(faker.date.past()),
    description: faker.lorem.paragraph(),
    city: faker.address.city()
});