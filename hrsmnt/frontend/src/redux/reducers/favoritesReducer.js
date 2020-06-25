import {ADD_FAVORITE, DELETE_FAVORITE, FETCH_FAVORITES} from "../types";

const initialState = {
    list: [],
    isFetched: false
}

export default function favoritesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_FAVORITES:
            return {list: action.payload, isFetched: true};
        case ADD_FAVORITE:
            return {...state, list: [...state.list, action.payload]};
        case DELETE_FAVORITE:
            return {...state, list: state.list.filter(item => item.id !== action.payload.id)}
        default: return state;
    }
}