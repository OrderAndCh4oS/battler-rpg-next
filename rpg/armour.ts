import {Armour} from "./interface";
import {ArmourType} from "./enum";

export const cloth: Armour = {
    name: "cloth",
    value: 0,
    weight: 1,
    material: ArmourType.none,
    price: 0
};

export const quiltPadding: Armour = {
    name: "quiltPadding",
    value: 2,
    weight: 3,
    material: ArmourType.padded,
    price: 10
};

export const leatherArmour: Armour = {
    name: "leatherArmour",
    value: 4,
    weight: 7,
    material: ArmourType.leather,
    price: 17
};

export const studdedLeatherArmour: Armour = {
    name: "studdedLeatherArmour",
    value: 7,
    weight: 11,
    material: ArmourType.leather,
    price: 20
};

export const mail: Armour = {
    name: "mail",
    value: 10,
    weight: 20,
    material: ArmourType.mail,
    price: 30
};

export const plate: Armour = {
    name: "plate",
    value: 12,
    weight: 35,
    material: ArmourType.plate,
    price: 50
};
