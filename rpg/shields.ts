import {Shield} from "./interface";

const shields: Record<string, Shield> = {
    buckler: {
        name: "buckler",
        blockChance: 22,
        durability: 500,
        weight: 7,
        price: 20
    },
    roundShield: {
        name: "roundShield",
        blockChance: 28,
        durability: 1000,
        weight: 11,
        price: 50
    },
    longShield: {
        name: "longShield",
        blockChance: 36,
        durability: 1500,
        weight: 16,
        price: 80
    }
};

export default shields;
