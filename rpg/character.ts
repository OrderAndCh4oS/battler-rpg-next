import {Actor, Character} from "./interface";
import weapons from "./weapons";
import armours from "./armour";

const makeBaseActor = (): Actor => ({
    int: 1,
    str: 1,
    dex: 1,
    mainHand: weapons.fist,
    offHand: weapons.fist,
    armour: armours.cloth
});

const makeBaseCharacter = (): Character => ({
    name: "Anon.",
    actor: makeBaseActor(),
    experience: 0,
    gold: 0,
    wins: 0,
    losses: 0,
    image: ''
});

export const makeCharacter = (name: string, image: string): Character => ({
    ...makeBaseCharacter(),
    name,
    image
});
