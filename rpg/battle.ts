import {Actor, AttackStats, Character, Combatant, DodgeStats, Shield, Weapon} from "./interface";
import {
    makeAttackStats,
    makeBlockStats,
    makeCriticalHitStats,
    makeDamageStats,
    makeDodgeStats,
    makeRoundStats,
    makeWoundStats
} from "./stats";
import {getArmourReduction} from "./armour-reductions";

interface ILogger {
    log: (...args: string[]) => void;
}

export class Logger implements ILogger {
    log(...args: string[]) {
        console.log(...args);
    }
}

export class LoggerRenderer implements ILogger {
    constructor(private readonly addToLog: (logs: string[]) => void) {
    }

    log(...args: string[]) {
        this.addToLog(args);
    }
}

class Battler {
    constructor(private readonly logger: ILogger) {
    }

    start(characterOne: Character, characterTwo: Character) {
        let combatantOne = this.makeCombatant(characterOne),
            combatantTwo = this.makeCombatant(characterTwo);
        let attacker, defender;
        [attacker, defender] = this.getRoundAttackerDefender(combatantOne, combatantTwo);
        let turn = 1;
        while (true) {
            this.logger.log("---Attack Start---");
            // Todo: implement some form of action command chain
            this.logger.log(`${attacker.character.name}\nattacks: ${attacker.attacks},\nremainder: ${attacker.attackRemainder}\ninitiative: ${attacker.initiative}\nweight: ${attacker.weight}\nhealth: ${attacker.health}`);
            this.logger.log(`${defender.character.name}\nattacks: ${defender.attacks},\nremainder: ${defender.attackRemainder}\ninitiative: ${defender.initiative}\nweight: ${defender.weight}\nhealth: ${defender.health}`);
            this.logger.log(".................");

            attacker.attacks--;
            const weapon = attacker.character.actor.mainHand;
            this.attack(attacker, defender, weapon, "mainHand");
            if ("damage" in attacker.character.actor.offHand) {
                this.attack(attacker, defender, weapon, "offHand");
            }

            if (defender.health <= 0) {
                this.handleBattleEnd(attacker, defender);
                break;
            }

            // Todo: split attacks more evenly
            if (attacker.attacks < defender.attacks) {
                [attacker, defender] = [defender, attacker];
            }

            if (attacker.attacks === 0 && defender.attacks === 0) {
                this.logger.log(`+++++Turn ${turn} End+++++`);
                turn++;
                this.updateCombatant(combatantOne);
                this.updateCombatant(combatantTwo);
                [attacker, defender] = this.getRoundAttackerDefender(combatantOne, combatantTwo);
            }
        }
        return {combatantOne, combatantTwo};
    }

    private getWeight(actor: Actor) {
        return Math.max(0, (actor.armour.weight + actor.mainHand.weight + this.getOffhandWeight(actor.offHand)) - (actor.strength / 2));
    }

    private getInitiative(actor: Actor, remainder: number): number {
        return actor.intelligence - this.getWeight(actor) + (actor.dexterity / 4) + remainder;
    }

    private getRoll() {
        return Math.round(Math.random() * 100);
    }

    private makeCombatant(character: Character) {
        const {attacks, attackRemainder} = this.getAttacks(character.actor);
        const health = this.getHealth(character.actor);
        const initiative = this.getInitiative(character.actor, attackRemainder);
        const weight = this.getWeight(character.actor);
        return {
            character,
            attacks,
            attackRemainder,
            weight,
            initiative,
            health,
            roundStats: makeRoundStats()
        };
    }

    private updateCombatant(combatant: Combatant) {
        const {attacks, attackRemainder} = this.getAttacks(combatant.character.actor, combatant.attackRemainder);
        combatant.attacks = attacks;
        combatant.attackRemainder = attackRemainder;
        combatant.initiative = this.getInitiative(combatant.character.actor, combatant.attackRemainder);
        combatant.weight = this.getWeight(combatant.character.actor);
    }

    private getAttackHitChance(attacker: Character, defender: Character) {
        const dexHitChance = (attacker.actor.dexterity - defender.actor.dexterity) / 10;
        const intHitChance = (attacker.actor.intelligence - defender.actor.intelligence) / 10;
        return Math.round(50 - dexHitChance + intHitChance);
    }

    private getDodgeChance(defender: Character, attacker: Character) {
        const dexDodgeChance = (defender.actor.dexterity - attacker.actor.dexterity) / 10;
        const intDodgeChance = (defender.actor.intelligence - attacker.actor.intelligence) / 10;
        return Math.round(66 - dexDodgeChance + intDodgeChance);
    }

    private getCriticalHitChance(attacker: Character, defender: Character) {
        return 90 - ((attacker.actor.intelligence - defender.actor.intelligence) / 10);
    }

    private getDamageVariability(baseDamage: number, attacker: Character) {
        return Math.random() * baseDamage / ("damage" in attacker.actor.offHand ? 4 : 5);
    }

    private getDamage(attacker: Combatant, defender: Combatant, weapon: Weapon) {
        const criticalHitChance = this.getCriticalHitChance(attacker.character, defender.character);
        const criticalHitRoll = this.getRoll();
        const isCriticalHit = criticalHitRoll > criticalHitChance;
        let damage = this.getBaseDamage(attacker.character, weapon);
        damage += isCriticalHit ? damage / 2 : 0;
        damage = Math.round(damage);
        return {criticalHitChance, criticalHitRoll, isCriticalHit, damage};
    }

    private getBaseDamage(attacker: Character, weapon: Weapon) {
        const strengthModifier = (attacker.actor.strength / 5) * ("damage" in attacker.actor.offHand ? 0.5 : 1);
        const baseDamage = weapon.damage + strengthModifier;
        return baseDamage - this.getDamageVariability(baseDamage, attacker);
    }

    private performAttack(attacker: Combatant, defender: Combatant) {
        const baseHitChance = this.getAttackHitChance(attacker.character, defender.character);
        const weightHitChanceReduction = this.getWeight(defender.character.actor) / 10;

        const hitRoll = this.getRoll();
        const hitChance = baseHitChance + weightHitChanceReduction;
        const isHit = hitRoll > hitChance;

        return {hitChance, baseHitChance, weightHitChanceReduction, hitRoll, isHit};
    }

    private attemptDodge(defender: Combatant, attacker: Combatant) {
        const baseDodgeChance = this.getDodgeChance(defender.character, attacker.character);
        const weightDodgeChanceReduction = this.getWeight(defender.character.actor) / 10;

        const dodgeRoll = this.getRoll();
        const dodgeChance = baseDodgeChance + weightDodgeChanceReduction;
        const isDodge = dodgeRoll > dodgeChance;

        return {dodgeChance, baseDodgeChance, weightDodgeChanceReduction, dodgeRoll, isDodge};
    }

    private getRoundAttackerDefender(combatantOne: Combatant, combatantTwo: Combatant) {
        return combatantOne.initiative > combatantTwo.initiative
            ? [combatantOne, combatantTwo]
            : [combatantTwo, combatantOne];
    }

    private blockCheck(defender: Combatant) {
        const blockRoll = this.getRoll();
        const blockChance = "blockChance" in defender.character.actor.offHand
            ? 100 - defender.character.actor.offHand.blockChance
            : 0;
        return {blockRoll, blockChance};
    }

    private attack(attacker: Combatant, defender: Combatant, weapon: Weapon, hand: "mainHand" | "offHand") {
        const {
            hitChance,
            hitRoll,
            isHit,
            baseHitChance,
            weightHitChanceReduction
        } = this.performAttack(attacker, defender);
        this.logger.log(`${attacker.character.name} attack roll: required ${hitChance}, rolled ${hitRoll}`);
        this.logger.log(isHit ? "Hit success" : "Missed");
        const attackStats: AttackStats = makeAttackStats(hitChance, hitRoll, isHit, baseHitChance, weightHitChanceReduction, hand);
        const {
            dodgeChance,
            dodgeRoll,
            isDodge,
            baseDodgeChance,
            weightDodgeChanceReduction
        } = this.attemptDodge(defender, attacker);
        this.logger.log(`${defender.character.name} dodge roll: required ${dodgeChance}, rolled ${dodgeRoll}`);
        this.logger.log(isDodge ? "Dodge success" : "Dodge failure");
        attackStats.wasDodged = isDodge;
        const dodgeStats: DodgeStats = makeDodgeStats(dodgeChance, dodgeRoll, isDodge, baseDodgeChance, weightDodgeChanceReduction);
        if (isHit && !isDodge) {
            const {
                criticalHitChance,
                criticalHitRoll,
                isCriticalHit,
                damage
            } = this.getDamage(attacker, defender, weapon);
            const armourReduction = getArmourReduction(defender.character.actor.armour, attacker.character.actor.mainHand);

            this.logger.log(`${attacker.character.name} critical hit roll: required ${criticalHitChance}, rolled ${criticalHitRoll}`);
            this.logger.log(isCriticalHit ? "Critical hit success" : "Critical hit failure");
            attackStats.criticalHitStats = makeCriticalHitStats(criticalHitChance, criticalHitRoll, isCriticalHit);

            let isBlock = false;

            if ("blockChance" in defender.character.actor.offHand && defender.character.actor.offHand.durability > 0) {
                const {blockRoll, blockChance} = this.blockCheck(defender);
                isBlock = blockRoll > blockChance;
                defender.character.actor.offHand.durability -= damage;
                this.logger.log(`${defender.character.name} block roll: required ${blockChance}, rolled ${blockRoll}`);
                this.logger.log(isBlock ? "Block success" : "Block failure");
                const blockStats = makeBlockStats(blockChance, blockRoll, damage, isBlock);
                defender.roundStats.blocks.push(blockStats);
            }

            if (!isBlock) {
                defender.health -= damage - armourReduction;
                this.logger.log(`${attacker.character.name} dealt ${isCriticalHit ? "critical damage" : "damage"}: ${damage}`);
                this.logger.log(`${defender.character.name} health: ${defender.health}`);
                attackStats.damageStats = makeDamageStats(damage, defender.character.actor.armour.material, armourReduction);
            }

            const woundStats = makeWoundStats(weapon, defender.character.actor.armour, attacker.character.actor.strength, isCriticalHit, damage, armourReduction);
            defender.roundStats.wounds.push(woundStats);
        }

        attacker.roundStats.attacks.push(attackStats);
        defender.roundStats.dodges.push(dodgeStats);
    }

    private handleBattleEnd(attacker: Combatant, defender: Combatant) {
        attacker.character.wins += 1;
        attacker.character.experience += 200;
        defender.character.experience += 75;
        attacker.character.gold += 10;
        defender.character.gold += 5;
        defender.character.losses += 1;
        this.logger.log(`${attacker.character.name} wins`);
        this.logger.log(`${attacker.character.name} health: ${attacker.health}`);
        this.logger.log(`${defender.character.name} health: ${defender.health}`);
    }

    private getAttacks(actor: Actor, attackRemainder: number = 0): { attacks: number, attackRemainder: number } {
        let attacks = Math.max(0, Math.round((actor.dexterity + attackRemainder - this.getWeight(actor)) / 33));
        attackRemainder = Math.max(0, (actor.dexterity + attackRemainder - this.getWeight(actor))) % 33;
        return {attacks, attackRemainder};
    }

    private getHealth(actor: Actor): number {
        return actor.strength * 2;
    }

    private getOffhandWeight(offHand: Weapon | Shield) {
        if ("damage" in offHand) return offHand.weight;
        if (offHand.durability > 0) return offHand.weight;
        return 0;
    }
}

export default Battler;

// const actorOne: Actor = {
//     intelligence: 40,
//     strength: 50,
//     dexterity: 60,
//     mainHand: shortSpear,
//     offHand: buckler,
//     armour: leatherArmour,
// }
//
// const actorTwo: Actor = {
//     intelligence: 45,
//     strength: 65,
//     dexterity: 40,
//     mainHand: hatchet,
//     offHand: dagger,
//     armour: quiltPadding,
// }
//
// const actorThree: Actor = {
//     intelligence: 25,
//     strength: 100,
//     dexterity: 25,
//     mainHand: longSword,
//     offHand: dagger,
//     armour: plate,
// }
//
// const actorFour: Actor = {
//     intelligence: 100,
//     strength: 25,
//     dexterity: 25,
//     mainHand: hatchet,
//     offHand: dagger,
//     armour: quiltPadding,
// }
//
// const actorFive: Actor = {
//     intelligence: 25,
//     strength: 25,
//     dexterity: 100,
//     mainHand: dagger,
//     offHand: dagger,
//     armour: quiltPadding,
// }
//
// const characterOne: Character = {
//     name: 'one',
//     actor: actorOne,
//     experience: 0,
//     gold: 0,
//     wins: 0,
//     losses: 0
// }
//
// const characterTwo: Character = {
//     name: 'two',
//     actor: actorTwo,
//     experience: 0,
//     gold: 0,
//     wins: 0,
//     losses: 0
// }
//
// const characterThree: Character = {
//     name: 'three',
//     actor: actorThree,
//     experience: 0,
//     gold: 0,
//     wins: 0,
//     losses: 0
// }
//
// const characterFour: Character = {
//     name: 'four',
//     actor: actorFour,
//     experience: 0,
//     gold: 0,
//     wins: 0,
//     losses: 0
// }
//
// const characterFive: Character = {
//     name: 'five',
//     actor: actorFive,
//     experience: 0,
//     gold: 0,
//     wins: 0,
//     losses: 0
// }

// const characters = [characterOne, characterTwo, characterThree, characterFour, characterFive]


// const battleResults: BattleResults[] = [
//     {
//         character: characters[0],
//         results: []
//     },
//     {
//         character: characters[1],
//         results: []
//     }
// ];
//
// const getAttackRateStats = (combatant: Combatant): AttackRateStats => {
//     const name = combatant.character.name;
//     const count = combatant.roundStats.attacks.length;
//     const successCount = combatant.roundStats.attacks.filter(a => a.isSuccessful).length;
//     const successRate = Number((successCount / count).toFixed(3));
//     const criticalHitSuccessCount = combatant.roundStats.attacks.filter(a => a.criticalHitStats?.isSuccessful).length;
//     const criticalHitSuccessRate = Number((criticalHitSuccessCount / count).toFixed(3));
//     const totalDamage = combatant.roundStats.attacks.reduce((total: number, a) => total += a.damageStats ? a.damageStats.damageCaused : 0, 0);
//     const totalDamageGiven = combatant.roundStats.attacks.reduce((total: number, a) => total += a.damageStats ? a.damageStats.damageCaused - a.damageStats.damageBlockedByArmour : 0, 0);
//     const averageDamage = Math.round(totalDamage / count);
//     const averageDamageGiven = Math.round(totalDamageGiven / count);
//     return {
//         name,
//         count,
//         successCount,
//         successRate,
//         totalDamage,
//         averageDamage,
//         criticalHitSuccessCount,
//         criticalHitSuccessRate,
//         totalDamageGiven,
//         averageDamageGiven
//     };
// };
//
// const getDodgeStats = (defender: Combatant): DodgeCheckStats => {
//     const name = defender.character.name;
//     const count = defender.roundStats.dodges.length;
//     const successCount = defender.roundStats.dodges.filter(d => d.isSuccessful).length;
//     const successRate = Number((successCount / count).toFixed(3));
//     return {name, count, successCount, successRate}
// }
//
// const getBlockStats = (combatant: Combatant): BlockCheckStats => {
//     const name = combatant.character.name;
//     const count = combatant.roundStats.blocks.length;
//     const successCount = combatant.roundStats.blocks.filter(b => b.isSuccessful).length;
//     const successRate = Number((successCount / count).toFixed(3));
//     return {name, count, successCount, successRate: !isNaN(successRate) ? successRate : 0}
// }

// for (let i = 0; i < 100; i++) {
//     const [combatantOne, combatantTwo] = battle(characterOne, characterTwo);
//
//     console.log('\n####################\n');
//
//     const combatantOneStats: CombatantStats = {
//         attackRateStats: getAttackRateStats(combatantOne),
//         dodgeStats: dodgeStats(combatantOne),
//         blockStats: blockStats(combatantOne)
//     };
//
//     const combatantTwoStats: CombatantStats = {
//         attackRateStats: getAttackRateStats(combatantTwo),
//         dodgeStats: dodgeStats(combatantTwo),
//         blockStats: blockStats(combatantTwo)
//     };
//
//     battleResults[0].results.push(combatantOneStats);
//     battleResults[1].results.push(combatantTwoStats);
// }
//
// const logCharacterStats = (character: Character | undefined) => {
//     console.log('Wins: ', character?.wins);
//     console.log('Losses: ', character?.losses);
//     console.log('Exp: ', character?.experience);
//     console.log('Gold: ', character?.gold);
// };
//
// console.log(`${capitalise(battleResults[0].character?.name)} vs ${capitalise(battleResults[1].character?.name)}`);
//
// console.log('================\n');
//
// const logResults = (results: CombatantStats[]) => {
//     const totalDamage = results.reduce((count: number, r) => count += r.attackRateStats.totalDamage, 0);
//     const totalDamageGiven = results.reduce((count: number, r) => count += r.attackRateStats.totalDamageGiven, 0);
//     const totalAttacks = results.reduce((count: number, r) => count += r.attackRateStats.count, 0);
//     const totalSuccessfulAttacks = results.reduce((count: number, r) => count += r.attackRateStats.successCount, 0);
//     const totalCriticalHits = results.reduce((count: number, r) => count += r.attackRateStats.criticalHitSuccessCount, 0);
//     console.log('Total Damage:', totalDamage);
//     console.log('Total Damage Given:', totalDamageGiven);
//     console.log('Total Attacks:', totalAttacks);
//     console.log('Total Successful Attacks:', totalSuccessfulAttacks);
//     console.log('Total Critical Hits:', totalCriticalHits);
//     console.log('Average Damage:', Number((totalDamage / totalAttacks).toFixed(3)));
//     console.log('Average Damage Given:', Number((totalDamageGiven / totalAttacks).toFixed(3)));
// };
//
// for (let i = 0; i < 2; i++) {
//     console.log(`${capitalise(battleResults[i].character?.name)} Stats`);
//     console.log('::::::::::::::::');
//     logCharacterStats(battleResults[i].character);
//     logResults(battleResults[i].results);
//     console.log('\n~~~~~~~~~~~~~~~~\n');
// }