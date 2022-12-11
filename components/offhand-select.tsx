import React, {FC} from "react";
import {Item, Shield} from "../rpg/interface";
import * as allShields from '../rpg/shields';
import ItemSelect from "./item-select";

interface IShieldSelectProps {
    setCharacterShield: (shield: Shield) => void
}

const isShield = (item: Item | Shield): item is Shield => {
    return 'blockChance' in item;
}

const ShieldSelect: FC<IShieldSelectProps> = ({setCharacterShield}) => {
    const shields = [...(Object.values(allShields).sort((a, b) => a.price - b.price))];
    const selectShield = (item: Item) => {
        if (!isShield(item)) return;
        setCharacterShield(item);
    }

    return (
        <ItemSelect items={shields} selectItem={selectShield}/>
    );
}

export default ShieldSelect;
