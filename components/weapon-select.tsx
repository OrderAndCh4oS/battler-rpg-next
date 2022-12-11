import React, {FC} from "react";
import {Item, Weapon} from "../rpg/interface";
import * as allWeapons from '../rpg/weapons';
import ItemSelect from "./item-select";

interface IWeaponSelectProps {
    setCharacterWeapon: (weapon: Weapon) => void
}

const isWeapon = (item: Item | Weapon): item is Weapon => {
    return 'damage' in item;
}

const WeaponSelect: FC<IWeaponSelectProps> = ({setCharacterWeapon}) => {
    const weapons = [...(Object.values(allWeapons).sort((a, b) => a.price - b.price))];
    const selectWeapon = (item: Item) => {
        if (!isWeapon(item)) return;
        setCharacterWeapon(item);
    }

    return (
        <ItemSelect items={weapons} selectItem={selectWeapon}/>
    );
}

export default WeaponSelect;
