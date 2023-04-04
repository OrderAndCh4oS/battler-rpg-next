import {ArmourType, EdgeType} from "./enum";

export interface CoreStats {
    int: number;
    str: number;
    dex: number;
}

export interface Actor extends CoreStats {
    mainHand: Weapon;
    offHand: Weapon | Shield;
    armour: Armour;
}

export interface Item {
    name: string,
    price: number,
    weight: number

}

export interface Weapon extends Item {
    damage: number;
    edge: EdgeType;
}

export interface Shield extends Item {
    blockChance: number;
    durability: number;
}

export interface Armour extends Item {
    value: number;
    material: ArmourType;
}

export interface Combatant {
    character: Character;
    attacks: number;
    attackRemainder: number;
    weight: number;
    initiative: number;
    health: number;
    roundStats: RoundStats;
}

export interface RoundStats {
    attacks: AttackStats[];
    dodges: DodgeStats[];
    blocks: BlockStats[];
    wounds: WoundStats[];
    winner: boolean | null;
}

export interface AttackStats {
    baseChance: number;
    weightChanceReduction: number;
    chance: number;
    rolled: number;
    isSuccessful: boolean;
    criticalHitStats?: CriticalHitStats;
    damageStats?: DamageStats;
    wasDodged?: boolean;
    hand: string;
}

export interface CriticalHitStats {
    chance: number;
    rolled: number;
    isSuccessful: boolean;
}

export interface BlockStats {
    chance: number;
    rolled: number;
    damage: number;
    isSuccessful: boolean;
}

export interface DamageStats {
    damageCaused: number;
    againstArmourType: ArmourType;
    damageBlockedByArmour: number;
}

export interface DodgeStats {
    baseChance: number;
    weightChanceReduction: number;
    chance: number;
    rolled: number;
    isSuccessful: boolean;
}

export interface WoundStats {
    weapon: Weapon;
    armour: Armour;
    attackerStrength: number;
    isCriticalDamage: boolean;
    damageTaken: number;
    damageBlockedByArmour: number;
}

export interface Character {
    name: string;
    gold: number;
    experience: number;
    actor: Actor;
    wins: number;
    losses: number;
    image: string;
    inventory: (Weapon | Armour | Shield)[],
    attributePoints: number,
    level: number
}

export interface BattleResults {
    character?: Character;
    results: CombatantStats[];
}

export interface CombatantStats {
    attackRateStats: AttackRateStats,
    dodgeStats: DodgeCheckStats,
    blockStats: BlockCheckStats
}

export interface CheckStats {
    name: string,
    count: number,
    successCount: number,
    successRate: number
}

export interface AttackRateStats extends CheckStats {
    totalDamage: number;
    averageDamage: number;
    totalDamageGiven: number;
    averageDamageGiven: number;
    criticalHitSuccessRate: number;
    criticalHitSuccessCount: number;
}

export interface DodgeCheckStats extends CheckStats {

}

export interface BlockCheckStats extends CheckStats {

}
