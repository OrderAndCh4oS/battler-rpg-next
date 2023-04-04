import map from "./map";


const getGold = (winChance: number) =>
    ~~map((10 + -((winChance - 0.5) * 10) * 2), 0, 20, 3, 30);

export default getGold;
