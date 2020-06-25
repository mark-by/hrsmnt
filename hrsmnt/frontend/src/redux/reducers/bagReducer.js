import {ADD_ITEM_TO_BAG, CLEAR_ERROR, DELETE_ITEM_FROM_BAG} from "../types";
const initialState = {list: []}

export const bagReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM_TO_BAG:
            return {list: [...state.list, action.payload]};
        case DELETE_ITEM_FROM_BAG:
            return {list: state.list.filter(item => item !== action.payload)}
        default: return state;
    }
}