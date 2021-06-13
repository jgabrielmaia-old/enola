import { gamefy } from "./app/game-creator";
import { save } from "./app/state-management";

gamefy().then(response => save(response, "game.json"));