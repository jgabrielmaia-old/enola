import * as faker from "faker";

const baseDate = faker.datatype.number({ min: 1, max: 28 })
const baseMonth = faker.date.month({ abbr: true })
const baseYear = new Date().getFullYear();

export const referenceDate = () => `${baseMonth} ${baseDate}, ${baseYear}`
export const witnessDate = () => `${baseMonth} ${faker.datatype.number({ min: 1, max: baseDate - 1 })}, ${baseYear}`