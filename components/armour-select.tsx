import React, {FC} from "react";
import {Armour, Item} from "../rpg/interface";
import allArmours from '../rpg/armour';
import ItemSelect from "./item-select";

interface IArmourSelectProps {
    setCharacterArmour: (armour: Armour) => void
}

const isArmour = (item: Item | Armour): item is Armour => {
    return 'material' in item;
}

const ArmourSelect: FC<IArmourSelectProps> = ({setCharacterArmour}) => {
    const sortedArmours = [...(Object.values(allArmours).sort((a, b) => a.price - b.price))];
    const selectArmour = (item: Item) => {
        if (!isArmour(item)) return;
        setCharacterArmour(item);
    }

    return (
        <ItemSelect
            items={sortedArmours}
            selectItem={selectArmour}
        />
    );
}

export default ArmourSelect;
