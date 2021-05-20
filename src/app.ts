import { gamefy } from "./app/game-creator";
import { switcher } from "./app/text-templating/switcher";
// import { textTemplating } from "./app/text-templating/text-templating";
// textTemplating(__dirname +../../../conf/templates/template_sample.json")
// gamefy();

console.log(
    switcher('CRIME', 'ARTICLE'),
    switcher('CRIME', 'COMMITER'),
    switcher('CRIME', 'NOTICE'),
    switcher('CRIME', 'TYPE'));