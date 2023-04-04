import {Actor, Character} from "./interface";
import weapons from "./weapons";
import armours from "./armour";

const makeBaseActor = (): Actor => ({
    int: 3,
    str: 3,
    dex: 3,
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
    image: '',
    inventory: [],
    attributePoints: 0,
    level: 1
});

export const makeCharacter = (name: string, image: string): Character => ({
    ...makeBaseCharacter(),
    name,
    image
});
