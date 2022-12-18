import {Shield} from "./interface";

const shields: Record<string, Shield> = {
    buckler: {
        name: "buckler",
        blockChance: 15,
        durability: 500,
        weight: 6,
        price: 20
    },
    roundShield: {
        name: "roundShield",
        blockChance: 20,
        durability: 1000,
        weight: 20,
        price: 50
    },
    longShield: {
        name: "longShield",
        blockChance: 25,
        durability: 1500,
        weight: 30,
        price: 80
    }
};

export default shields;
