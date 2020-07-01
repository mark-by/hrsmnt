import {ADD_ITEM_TO_BAG, CLEAR_BAG, DELETE_ITEM_FROM_BAG, RESTORE_BAG} from "../types";
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
        default: return state;
    }
}