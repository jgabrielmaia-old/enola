import * as faker from "faker";

const baseDate = faker.datatype.number({ min: 1, max: 28 })
const baseMonth = faker.date.month({ abbr: true })

export const referenceDate = () => `${baseMonth} ${baseDate}`
export const witnessDate = () => `${baseMonth} ${faker.datatype.number({ min: 1, max: baseDate - 1 })}`