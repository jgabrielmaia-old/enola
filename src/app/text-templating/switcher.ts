import { ISwitcher } from "../interfaces/iswitcher";
import { load } from "../state-management";

const switchers: ISwitcher[] = load(__dirname + `/../../../conf/switches.json`);
let switcherType = '';

export const switcher = (name?: string, caseType?: string, caseProperty?: string) => {
    if (!switcherType) {
        switcherType = caseType;
    }

    console.log(
        switchers
            .find(switcher => switcher.name == name).cases
            .filter(c => c['TYPE'] == switcherType)
            .map(c => c[caseProperty])
    );
}