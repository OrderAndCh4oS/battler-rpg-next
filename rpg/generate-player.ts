import {Character} from "./interface";
import {makeCharacter} from "./character";
import weapons from "./weapons";
import armours from "./armour";
import {pickRandomCharacterImage} from "../utilities/character-images";

const getPercentValue = (value: number, percentage: number) => ~~(value / 100 * (percentage * 100));

const generatePlayer = (name: string): Character => {
    const player = makeCharacter(name, pickRandomCharacterImage());
    player.actor.mainHand = weapons.dagger;
    player.actor.armour = armours.cloth;
    const statPoints = 15;
    const modifier = getPercentValue(statPoints, 0.3);
    const statCapModifierRoll = Math.round(Math.random() * modifier - modifier * 0.75);
    let statCap = statPoints + statCapModifierRoll
    while (statCap > 0) {
        const roll = Math.random() * 6 + 1;
        const stat = ['str', 'dex', 'int'][~~(Math.random() * 3)] as 'str' | 'dex' | 'int'
        const value = Math.round(Math.min(statCap, roll));
        player.actor[stat] += value
        statCap -= value;
    }

    return player;
}

export default generatePlayer;
