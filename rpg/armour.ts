import {ArmourType} from "./enum";
import {Armour} from "./interface";

const armours: Record<string, Armour> = {
    cloth: {
        name: "cloth",
        value: 0,
        weight: 1,
        material: ArmourType.none,
        price: 0
    },
    quiltPadding: {
        name: "quiltPadding",
        value: 2,
        weight: 3,
        material: ArmourType.padded,
        price: 10
    },
    leatherArmour: {
        name: "leatherArmour",
        value: 4,
        weight: 7,
        material: ArmourType.leather,
        price: 17
    },
    studdedLeatherArmour: {
        name: "studdedLeatherArmour",
        value: 7,
        weight: 11,
        material: ArmourType.leather,
        price: 20
    },
    mail: {
        name: "mail",
        value: 10,
        weight: 20,
        material: ArmourType.mail,
        price: 30
    },
    plate: {
        name: "plate",
        value: 12,
        weight: 35,
        material: ArmourType.plate,
        price: 50
    },
}

export default armours;
