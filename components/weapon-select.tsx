import React, {FC} from "react";
import {Item, Weapon} from "../rpg/interface";
import weapons from '../rpg/weapons';
import ItemSelect from "./item-select";

interface IWeaponSelectProps {
    setCharacterWeapon: (weapon: Weapon) => void
}

const isWeapon = (item: Item | Weapon): item is Weapon => {
    return 'damage' in item;
}

const WeaponSelect: FC<IWeaponSelectProps> = ({setCharacterWeapon}) => {
    const sortedWeapons = [...(Object.values(weapons).sort((a, b) => a.price - b.price))];
    const selectWeapon = (item: Item) => {
        if (!isWeapon(item)) return;
        setCharacterWeapon(item);
    }

    return (
        <ItemSelect
            items={sortedWeapons}
            selectItem={selectWeapon}
        />
    );
}

export default WeaponSelect;
