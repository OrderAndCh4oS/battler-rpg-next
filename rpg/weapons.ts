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
    damage: 12,
    weight: 10,
    price: 20
};

export const hatchet: Weapon = {
    name: "hatchet",
    edge: EdgeType.slash,
    damage: 14,
    weight: 9,
    price: 25
};

export const shortSword: Weapon = {
    name: "shortSword",
    edge: EdgeType.slash,
    damage: 16,
    weight: 12,
    price: 30
};

export const shortSpear: Weapon = {
    name: "shortSpear",
    edge: EdgeType.pierce,
    damage: 15,
    weight: 11,
    price: 40
};

export const sabre: Weapon = {
    name: "sabre",
    edge: EdgeType.slash,
    damage: 14,
    weight: 10,
    price: 33
};

export const axe: Weapon = {
    name: "axe",
    edge: EdgeType.slash,
    damage: 17,
    weight: 13,
    price: 50
};

export const broadSword: Weapon = {
    name: "broadSword",
    edge: EdgeType.slash,
    damage: 18,
    weight: 14,
    price: 60
};

export const mace: Weapon = {
    name: "mace",
    edge: EdgeType.blunt,
    damage: 19,
    weight: 16,
    price: 68
};

export const flail: Weapon = {
    name: "flail",
    edge: EdgeType.blunt,
    damage: 20,
    weight: 15,
    price: 60
};

export const longSword: Weapon = {
    name: "longSword",
    edge: EdgeType.blunt,
    damage: 19,
    weight: 14,
    price: 70
};
