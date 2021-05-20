import faker from "faker";
import { ISwitcher } from "../interfaces/iswitcher";
import { load } from "../state-management";

const switchers: ISwitcher[] = load(__dirname + `/../../../conf/switches.json`);
let switcherType = '';

export const switcher = (name: string, caseProperty: string) => {
    if (!switcherType) {
        const cases = switchers.find(switcher => switcher.name == name).cases;
        switcherType = faker.random.arrayElement(cases)[`TYPE`];
    }

    return (
        switchers
            .find(switcher => switcher.name == name).cases
            .filter(c => c['TYPE'] == switcherType)
            .map(c => c[caseProperty])
            .reduce(c => c)
    );
}