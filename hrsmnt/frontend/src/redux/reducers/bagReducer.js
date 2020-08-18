import {
    ADD_ITEM_TO_BAG,
    CLEAR_BAG,
    DELETE_BAG_ITEMS,
    DELETE_ITEM_FROM_BAG,
    RESTORE_BAG,
    SET_BAG_PRICE,
    SET_DELIVERY_PRICE, SET_PROMOCODE
} from "../types";
const initialState = {
    list: [],
    restored: false,
    bagPrice: 0,
    deliveryPrice: 0,
    promocode: {
        code: null,
        description: null,
        title: null
    }
}

export const bagReducer = (state = initialState, action) => {
    let newList;
    switch (action.type) {
        case ADD_ITEM_TO_BAG:
            newList = [...state.list, action.payload];
            localStorage.setItem('bag', JSON.stringify(newList))
            return {...state, list: newList};
        case DELETE_ITEM_FROM_BAG:
            newList = state.list.filter(item => item !== action.payload);
            localStorage.setItem('bag', JSON.stringify(newList))
            return {...state, list: newList}
        case RESTORE_BAG:
            return {list: action.payload.list, restored: true, deliveryPrice: action.payload.deliveryPrice, bagPrice: action.payload.bagPrice, promocode: {code: null, description: null, title: null}}
        case CLEAR_BAG:
            localStorage.removeItem('bag');
            localStorage.removeItem('bagPrice');
            localStorage.removeItem('deliveryPrice');
            return {...initialState, restored: true};
        case DELETE_BAG_ITEMS:
            newList = state.list.filter(item => action.payload.findIndex(el => el.id === item.id && el.size === item.size) === -1);
            localStorage.setItem('bag', JSON.stringify(newList));
            return {...state, list: newList};
        case SET_BAG_PRICE:
            localStorage.setItem('bagPrice', action.payload);
            return {...state, bagPrice: action.payload};
        case SET_DELIVERY_PRICE:
            localStorage.setItem('deliveryPrice', action.payload);
            return {...state, deliveryPrice: action.payload};
        case SET_PROMOCODE:
            return {...state, promocode: action.payload}
        default: return state;
    }
}