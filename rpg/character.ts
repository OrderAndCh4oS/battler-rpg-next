import {Actor, Character} from "./interface";
import {fist} from "./weapons";
import {cloth} from "./armour";

const baseActor: Actor = {
    intelligence: 8,
    strength: 8,
    dexterity: 8,
    mainHand: fist,
    offHand: fist,
    armour: cloth
};

const baseCharacter: Character = {
    name: "Anon.",
    actor: baseActor,
    experience: 0,
    gold: 0,
    wins: 0,
    losses: 0
};

export const makeCharacter = (name: string) => ({
    ...baseCharacter,
    name
});
