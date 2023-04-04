export default function getXpLevels(baseXP: number, difficultyModifier: number, maxLevel: number): number[] {
    const levelXPArray: number[] = [];

    for (let level = 1; level <= maxLevel; level++) {
        const levelXP = Math.round(baseXP * (level ** difficultyModifier));
        levelXPArray.push(levelXP);
    }

    return levelXPArray;
}
