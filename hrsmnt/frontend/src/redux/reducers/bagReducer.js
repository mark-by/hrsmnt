import {ADD_ITEM_TO_BAG, CLEAR_BAG, DELETE_BAG_ITEMS, DELETE_ITEM_FROM_BAG, RESTORE_BAG} from "../types";
const initialState = {list: [], restored: false}

export const bagReducer = (state = initialState, action) => {
    let newList;
    switch (action.type) {
        case ADD_ITEM_TO_BAG:
            newList = [...state.list, action.payload];
            localStorage.setItem('bag', JSON.stringify(newList))
            return {list: newList};
        case DELETE_ITEM_FROM_BAG:
            newList = state.list.filter(item => item !== action.payload);
            localStorage.setItem('bag', JSON.stringify(newList))
            return {list: newList}
        case RESTORE_BAG:
            return {list: action.payload, restored: true}
        case CLEAR_BAG:
            localStorage.removeItem('bag');
            return {list: [], restored: true};
        case DELETE_BAG_ITEMS:
            newList = state.list.filter(item => action.payload.findIndex(el => el.id === item.id && el.size === item.size) === -1)
            localStorage.setItem('bag', JSON.stringify(newList))
            return {list: newList}
        default: return state;
    }
}