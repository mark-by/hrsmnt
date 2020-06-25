import {
    ADD_ADDRESS,
    DELETE_ADDRESS,
    FETCH_ADDRESSES,
    SAVE_ADDRESS, SET_ADDRESSES,
    UPDATE_ADDRESS
} from "../types";

const initialState = {
    list: [],
    isFetched: false
}

export const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ADDRESSES:
            return {list: action.payload, isFetched: true}
        case DELETE_ADDRESS:
                return {...state, list: state.list.filter(addr => addr.id !== action.payload.id)}
        case ADD_ADDRESS:
            return {...state, list: state.list.concat({new: true})}
        case SAVE_ADDRESS:
            return {
                ...state, list: state.list.map(addr => {
                    if (addr.new) {
                        return action.payload
                    } else {
                        return addr
                    }
                })
            }
        case UPDATE_ADDRESS:
            return {...state, list: state.list.map(addr => {
                    if (addr.id === action.payload.id) {
                        return action.payload
                    } else {
                        return addr
                    }
                })}
        default:
            return state;
    }
}