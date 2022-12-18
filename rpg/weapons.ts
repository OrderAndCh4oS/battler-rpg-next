import {EdgeType} from "./enum"
import {Weapon} from "./interface";

const weapons: Record<string, Weapon> = {
    fist: {
        name: "fist",
        edge: EdgeType.blunt,
        damage: 2,
        weight: 1,
        price: 0
    },
    knuckleDuster: {
        name: "knuckleDuster",
        edge: EdgeType.blunt,
        damage: 4,
        weight: 3,
        price: 2
    },
    club: {
        name: "club",
        edge: EdgeType.blunt,
        damage: 8,
        weight: 6,
        price: 3
    },
    spikedClub: {
        name: "spikedClub",
        edge: EdgeType.blunt,
        damage: 9,
        weight: 7,
        price: 6
    },
    dagger: {
        name: "dagger",
        edge: EdgeType.pierce,
        damage: 10,
        weight: 5,
        price: 8
    },
    cudgel: {
        name: "cudgel",
        edge: EdgeType.blunt,
        damage: 12,
        weight: 10,
        price: 20
    },
    hatchet: {
        name: "hatchet",
        edge: EdgeType.slash,
        damage: 14,
        weight: 9,
        price: 25
    },
    shortSword: {
        name: "shortSword",
        edge: EdgeType.slash,
        damage: 16,
        weight: 12,
        price: 30
    },
    shortSpear: {
        name: "shortSpear",
        edge: EdgeType.pierce,
        damage: 15,
        weight: 11,
        price: 40
    },
    sabre: {
        name: "sabre",
        edge: EdgeType.slash,
        damage: 14,
        weight: 10,
        price: 33
    },
    axe: {
        name: "axe",
        edge: EdgeType.slash,
        damage: 17,
        weight: 13,
        price: 50
    },
    broadSword: {
        name: "broadSword",
        edge: EdgeType.slash,
        damage: 18,
        weight: 14,
        price: 60
    },
    mace: {
        name: "mace",
        edge: EdgeType.blunt,
        damage: 19,
        weight: 16,
        price: 68
    },
    flail: {
        name: "flail",
        edge: EdgeType.blunt,
        damage: 20,
        weight: 15,
        price: 60
    },
    longSword: {
        name: "longSword",
        edge: EdgeType.blunt,
        damage: 19,
        weight: 14,
        price: 70
    }
};

export default weapons;
