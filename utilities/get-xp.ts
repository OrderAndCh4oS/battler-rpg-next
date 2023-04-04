import map from "./map";


const getXp = (winChance: number) =>
    ~~map((100 + -((winChance - 0.5) * 100) * 2), 0, 200, 25, 500);

export default getXp;
