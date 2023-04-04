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
import getXpLevels from "../utilities/get-xp-levels";

interface ILogger {
    log: (...args: string[]) => void;
}

export class NullLogger implements ILogger {
    log(...args: string[]) {
        // Do Nothing
    }
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
                attacker.roundStats.winner = true;
                defender.roundStats.winner = false;
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
        return Math.max(0, (actor.armour.weight + actor.mainHand.weight + this.getOffhandWeight(actor.offHand)) - (actor.str / 2));
    }

    private getInitiative(actor: Actor, remainder: number): number {
        return actor.int - this.getWeight(actor) + (actor.dex / 4) + remainder;
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
        const dexHitChance = (attacker.actor.dex - defender.actor.dex) / 10;
        const intHitChance = (attacker.actor.int - defender.actor.int) / 10;
        return Math.round(50 - dexHitChance + intHitChance);
    }

    private getDodgeChance(defender: Character, attacker: Character) {
        const dexDodgeChance = ((defender.actor.dex - attacker.actor.dex) / 10) * 2;
        const intDodgeChance = ((defender.actor.int - attacker.actor.int) / 10) * 2;
        return Math.round(66 - Math.round(dexDodgeChance + intDodgeChance));
    }

    private getCriticalHitChance(attacker: Character, defender: Character) {
        return Math.min(90 - Math.round((attacker.actor.int - defender.actor.int) / 10) * 6, 99);
    }

    private getDamageVariability(baseDamage: number, attacker: Character) {
        return Math.random() * baseDamage / ("damage" in attacker.actor.offHand ? 3 : 5);
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
        const strengthModifier = (attacker.actor.str / 5) * ("damage" in attacker.actor.offHand ? 0.5 : 1);
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

            const woundStats = makeWoundStats(weapon, defender.character.actor.armour, attacker.character.actor.str, isCriticalHit, damage, armourReduction);
            defender.roundStats.wounds.push(woundStats);
        }

        attacker.roundStats.attacks.push(attackStats);
        defender.roundStats.dodges.push(dodgeStats);
    }

    private handleBattleEnd(attacker: Combatant, defender: Combatant) {
        attacker.character.wins += 1;
        defender.character.losses += 1;
        this.logger.log(`${attacker.character.name} wins`);
        this.logger.log(`${attacker.character.name} health: ${attacker.health}`);
        this.logger.log(`${defender.character.name} health: ${defender.health}`);
    }

    private getAttacks(actor: Actor, attackRemainder: number = 0): { attacks: number, attackRemainder: number } {
        let attacks = Math.max(0, Math.round((actor.dex + attackRemainder - this.getWeight(actor)) / 33));
        attackRemainder = Math.max(0, (actor.dex + attackRemainder - this.getWeight(actor))) % 33;
        return {attacks, attackRemainder};
    }

    private getHealth(actor: Actor): number {
        return actor.str * 1.5;
    }

    private getOffhandWeight(offHand: Weapon | Shield) {
        if ("damage" in offHand) return offHand.weight;
        if (offHand.durability > 0) return offHand.weight;
        return 0;
    }
}

export default Battler;
