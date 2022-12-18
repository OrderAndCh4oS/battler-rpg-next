import React, {FC} from "react";
import {Item, Shield} from "../rpg/interface";
import shields from '../rpg/shields';
import ItemSelect from "./item-select";

interface IShieldSelectProps {
    setCharacterShield: (shield: Shield) => void
}

export const isShield = (item: Item | Shield): item is Shield => {
    return 'blockChance' in item;
}

const ShieldSelect: FC<IShieldSelectProps> = ({setCharacterShield}) => {
    const sortedShields = [...(Object.values(shields).sort((a, b) => a.price - b.price))];
    const selectShield = (item: Item) => {
        if (!isShield(item)) return;
        setCharacterShield(item);
    }

    return (
        <ItemSelect
            items={sortedShields}
            selectItem={selectShield}
        />
    );
}

export default ShieldSelect;
