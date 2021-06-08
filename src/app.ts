import { gamefy } from "./app/game-creator";

gamefy().then(response => console.log(JSON.stringify(response, null, 4)));