import {
    Armour,
    AttackRateStats,
    AttackStats,
    BlockCheckStats,
    BlockStats,
    Combatant,
    CriticalHitStats,
    DamageStats,
    DodgeCheckStats,
    DodgeStats,
    RoundStats,
    Weapon,
    WoundStats
} from "./interface";
import {ArmourType} from "./enum";


export const makeRoundStats = (): RoundStats => ({
    attacks: [],
    dodges: [],
    blocks: [],
    wounds: [],
    winner: null
});

export const makeAttackStats = (
    chance: number,
    rolled: number,
    isSuccessful: boolean,
    baseChance: number,
    weightChanceReduction: number,
    hand: string
): AttackStats => ({
    baseChance,
    weightChanceReduction,
    chance,
    rolled,
    isSuccessful,
    hand
});

export const makeDodgeStats = (
    chance: number,
    rolled: number,
    isSuccessful: boolean,
    baseChance: number,
    weightChanceReduction: number
): DodgeStats => ({
    baseChance,
    weightChanceReduction,
    chance,
    rolled,
    isSuccessful
});

export const makeCriticalHitStats = (
    chance: number,
    rolled: number,
    isSuccessful: boolean
): CriticalHitStats => ({
    chance,
    rolled,
    isSuccessful
});

export const makeBlockStats = (
    chance: number,
    rolled: number,
    damage: number,
    isSuccessful: boolean
): BlockStats => ({
    chance,
    rolled,
    damage,
    isSuccessful
});

export const makeDamageStats = (
    damageCaused: number,
    againstArmourType: ArmourType,
    damageBlockedByArmour: number
): DamageStats => ({
    damageCaused,
    againstArmourType,
    damageBlockedByArmour
});

export const makeWoundStats = (
    weapon: Weapon,
    armour: Armour,
    attackerStrength: number,
    isCriticalDamage: boolean,
    damageTaken: number,
    damageBlockedByArmour: number
): WoundStats => ({
    weapon,
    armour,
    attackerStrength,
    isCriticalDamage,
    damageTaken,
    damageBlockedByArmour
});

export const getDodgeStats = (defender: Combatant): DodgeCheckStats => {
    const name = defender.character.name;
    const count = defender.roundStats.dodges.length;
    const successCount = defender.roundStats.dodges.filter(d => d.isSuccessful).length;
    const successRate = Number((successCount / count).toFixed(3));
    return {name, count, successCount, successRate}
}

export const getBlockStats = (combatant: Combatant): BlockCheckStats => {
    const name = combatant.character.name;
    const count = combatant.roundStats.blocks.length;
    const successCount = combatant.roundStats.blocks.filter(b => b.isSuccessful).length;
    const successRate = Number((successCount / count).toFixed(3));
    return {name, count, successCount, successRate: !isNaN(successRate) ? successRate : 0}
}

export const getAttackRateStats = (combatant: Combatant): AttackRateStats => {
    const name = combatant.character.name;
    const count = combatant.roundStats.attacks.length;
    const successCount = combatant.roundStats.attacks.filter(a => a.isSuccessful).length;
    const successRate = Number((successCount / count).toFixed(3));
    const criticalHitSuccessCount = combatant.roundStats.attacks.filter(a => a.criticalHitStats?.isSuccessful).length;
    const criticalHitSuccessRate = Number((criticalHitSuccessCount / count).toFixed(3));
    const totalDamage = combatant.roundStats.attacks.reduce((total: number, a) => total += a.damageStats ? a.damageStats.damageCaused : 0, 0);
    const totalDamageGiven = combatant.roundStats.attacks.reduce((total: number, a) => total += a.damageStats ? a.damageStats.damageCaused - a.damageStats.damageBlockedByArmour : 0, 0);
    const averageDamage = Math.round(totalDamage / count);
    const averageDamageGiven = Math.round(totalDamageGiven / count);
    return {
        name,
        count,
        successCount,
        successRate,
        totalDamage,
        averageDamage,
        criticalHitSuccessCount,
        criticalHitSuccessRate,
        totalDamageGiven,
        averageDamageGiven
    };
};
