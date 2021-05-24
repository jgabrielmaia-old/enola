import faker from "faker";
import { ISwitcher } from "../interfaces/iswitcher";
import { load } from "../state-management";

const switchers: ISwitcher[] = load(process.cwd() + `/conf/switches.json`);
const casesCache: any[] = [];
let switcherType = '';

export const switcher = (name: string, caseProperty: string) => {
    if ((caseProperty == 'TYPE' && switcherType != name) || switcherType == '') {
        if (!casesCache.some(c => c.name == name)) {
            const cases = faker.random.arrayElement(switchers.find(switcher => switcher.name == name).cases)
            casesCache.push({ name, cases });
            switcherType = cases['TYPE'];
        }
        else {
            switcherType = casesCache.find(c => c.name == name).cases['TYPE']
        }
    }

    return (
        switchers
            .find(switcher => switcher.name == name).cases
            .filter(c => c['TYPE'] == switcherType)
            .map(c => c[caseProperty])
            .reduce(c => c)
    );
}