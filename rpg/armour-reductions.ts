import {Armour, Weapon} from "./interface";
import {ArmourType, EdgeType} from "./enum";


export function getBluntEdgeArmourReduction(armour: Armour): number {
    switch (armour.material) {
        case ArmourType.none:
            return armour.value;
        case ArmourType.padded:
            return armour.value;
        case ArmourType.leather:
            return armour.value * 0.85;
        case ArmourType.mail:
            return armour.value * 0.9;
        case ArmourType.plate:
            return armour.value * 0.95;
    }
}

export function getPierceEdgeArmourReduction(armour: Armour): number {
    switch (armour.material) {
        case ArmourType.none:
            return armour.value;
        case ArmourType.padded:
            return armour.value * 0.5;
        case ArmourType.leather:
            return armour.value * 0.66;
        case ArmourType.mail:
            return armour.value * 0.75;
        case ArmourType.plate:
            return armour.value * 0.85;
    }
}

export function getSlashEdgeArmourReduction(armour: Armour): number {
    switch (armour.material) {
        case ArmourType.none:
            return armour.value;
        case ArmourType.padded:
            return armour.value * 0.75;
        case ArmourType.leather:
            return armour.value;
        case ArmourType.mail:
            return armour.value;
        case ArmourType.plate:
            return armour.value;
    }
}

export function getArmourReduction(armour: Armour, weapon: Weapon) {
    switch (weapon.edge) {
        case EdgeType.blunt:
            return getBluntEdgeArmourReduction(armour);
        case EdgeType.pierce:
            return getPierceEdgeArmourReduction(armour);
        case EdgeType.slash:
            return getSlashEdgeArmourReduction(armour);
    }
}
