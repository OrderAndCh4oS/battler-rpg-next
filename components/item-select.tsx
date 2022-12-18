import {FC} from "react";
import {Item} from "../rpg/interface";

interface IItemSelectProps {
    items: Item[]
    selectItem: (item: Item) => void;
}

const ItemSelect: FC<IItemSelectProps> = ({items, selectItem}) => {
    return (
        <div className='flex flex-wrap gap-4 pb-4'>
            {items.map(item =>
                <button
                    className='border rounded py-1 px-2'
                    key={`item_${item.name}_${Math.random().toString().slice(2)}`}
                    onClick={() => selectItem(item)}
                >
                    {item.name}
                </button>
            )}
        </div>
    );
}

export default ItemSelect;
