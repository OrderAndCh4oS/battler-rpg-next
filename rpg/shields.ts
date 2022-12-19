import {Shield} from "./interface";

const shields: Record<string, Shield> = {
    buckler: {
        name: "buckler",
        blockChance: 22,
        durability: 500,
        weight: 5,
        price: 20
    },
    roundShield: {
        name: "roundShield",
        blockChance: 28,
        durability: 1000,
        weight: 8,
        price: 50
    },
    longShield: {
        name: "longShield",
        blockChance: 35,
        durability: 1500,
        weight: 12,
        price: 80
    }
};

export default shields;
