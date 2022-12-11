import {Weapon} from "./interface";
import {EdgeType} from "./enum";

export const fist: Weapon = {
    name: "fist",
    edge: EdgeType.blunt,
    damage: 2,
    weight: 1,
    price: 0
};

export const knuckleDuster: Weapon = {
    name: "knuckleDuster",
    edge: EdgeType.blunt,
    damage: 4,
    weight: 3,
    price: 2
};

export const club: Weapon = {
    name: "club",
    edge: EdgeType.blunt,
    damage: 8,
    weight: 6,
    price: 3
};

export const spikedClub: Weapon = {
    name: "spikedClub",
    edge: EdgeType.blunt,
    damage: 9,
    weight: 7,
    price: 6
};

export const dagger: Weapon = {
    name: "dagger",
    edge: EdgeType.pierce,
    damage: 10,
    weight: 5,
    price: 8
};

export const cudgel: Weapon = {
    name: "cudgel",
    edge: EdgeType.blunt,
    damage: 28,
    weight: 16,
    price: 20
};

export const hatchet: Weapon = {
    name: "hatchet",
    edge: EdgeType.slash,
    damage: 25,
    weight: 12,
    price: 22
};

export const shortSword: Weapon = {
    name: "shortSword",
    edge: EdgeType.slash,
    damage: 35,
    weight: 14,
    price: 40
};

export const shortSpear: Weapon = {
    name: "shortSpear",
    edge: EdgeType.pierce,
    damage: 35,
    weight: 25,
    price: 40
};

export const sabre: Weapon = {
    name: "sabre",
    edge: EdgeType.slash,
    damage: 40,
    weight: 22,
    price: 65
};

export const axe: Weapon = {
    name: "axe",
    edge: EdgeType.slash,
    damage: 50,
    weight: 28,
    price: 50
};

export const broadSword: Weapon = {
    name: "broadSword",
    edge: EdgeType.slash,
    damage: 58,
    weight: 36,
    price: 60
};

export const mace: Weapon = {
    name: "mace",
    edge: EdgeType.blunt,
    damage: 60,
    weight: 27,
    price: 68
};

export const flail: Weapon = {
    name: "flail",
    edge: EdgeType.blunt,
    damage: 40,
    weight: 18,
    price: 60
};

export const longSword: Weapon = {
    name: "longSword",
    edge: EdgeType.blunt,
    damage: 62,
    weight: 22,
    price: 70
};
