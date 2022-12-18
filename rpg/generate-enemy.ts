import {Actor, Character, Item} from "./interface";
import {makeCharacter} from "./character";
import weapons from "./weapons";
import shields from "./shields";
import armours from "./armour";
import shuffle from "../utilities/shuffle";
import {pickRandomCharacterImage} from "../utilities/character-images";

const getPercentValue = (value: number, percentage: number) => ~~(value / 100 * (percentage * 100));

const filterByRemainingGold = (gold: number) => (item: Item) => {
    const leeway = getPercentValue(gold, 0.33);
    const modifier = (Math.random() * leeway - Math.round(leeway * 0.6));
    return item.price <= gold + leeway + modifier;
}

const generateEnemy = (actor: Actor): Character => {
    const statSum = actor.str + actor.dex + actor.int;
    let gold = actor.mainHand.price + actor.offHand.price + actor.armour.price;
    console.log('statSum', statSum);
    console.log('gold', gold);
    const enemy = makeCharacter('enemy', pickRandomCharacterImage());
    const sortedWeapons = [...(Object.values(weapons).sort((a, b) => a.price - b.price))];
    const sortedShields = [...(Object.values(shields).sort((a, b) => a.price - b.price))];
    const sortedArmours = [...(Object.values(armours).sort((a, b) => a.price - b.price))];
    enemy.actor.mainHand = shuffle(sortedWeapons.filter(weapon => weapon.price <= gold)).pop() ?? weapons.fist;
    gold -= enemy.actor.mainHand.price;
    enemy.actor.offHand = shuffle([
            ...sortedWeapons.filter(filterByRemainingGold(gold)),
            ...sortedShields.filter(filterByRemainingGold(gold))
        ]
    ).pop() ?? weapons.fist;
    gold -= enemy.actor.offHand.price;
    enemy.actor.armour = shuffle(sortedArmours.filter(filterByRemainingGold(gold))).pop() ?? armours.cloth;
    enemy.actor
    let statCap = statSum + getPercentValue(statSum, 0.1);
    console.log('statCap', statCap)
    console.log('statSum', statSum)
    while(statCap > 0) {
        const roll = Math.random() * 6 + 1;
        const stat = ['str', 'dex', 'int'][~~(Math.random() * 3)] as 'str' | 'dex' | 'int'
        const value = Math.round(Math.min(statCap, roll));
        enemy.actor[stat] += value
        statCap -= value;
    }

    return enemy;
}

export default generateEnemy;
