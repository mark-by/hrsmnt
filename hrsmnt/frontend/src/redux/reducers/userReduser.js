import {
    CHECK_EMAIL_TOKEN,
    DELETE_USER_DATA, FETCH_ORDER_HISTORY,
    FETCH_USER_DATA,
    SET_USER_DATA,
} from "../types";

const initialState = {
    data: {},
    emailToken: {isValid: false, isSet: false},
    addresses: [],
    orders: [],
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_DATA:
            return {...state, data: action.payload};
        case SET_USER_DATA:
            return {...state, data: {...state.data, ...action.payload}};
        case CHECK_EMAIL_TOKEN:
            return {...state, emailToken: {isValid: action.payload, isSet: true}};
        case DELETE_USER_DATA:
            return {...state, data: {}};
        case FETCH_ORDER_HISTORY:
            return {...state, orders: action.payload}
        default:
            return state;
    }
}