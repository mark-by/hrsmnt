import {FETCH_ITEM, FETCH_ITEMS, FETCH_SUGGESTIONS, ITEM_TOGGLE_FAVORITE} from "../types";

const initialState = {
    list: [],
    isFetched: false,
    suggestionsList: [],
    suggestionsFetched: false
}

export default function shopReducer(state = initialState, action) {
    let index;
    switch (action.type) {
        case FETCH_ITEMS:
            return {list: action.payload.map(item => {
                const index = state.list.findIndex(el => el.id === item.id);
                if (index !== -1) {
                    return state.list[index];
                } else {
                    return {...item, verbose_fetched: false}
                }}), isFetched: true}
        case FETCH_ITEM:
            index = state.list.findIndex(item => item.id === action.payload.id)
            if ( index !== -1) {
                return {
                    ...state, list: state.list.map((item, idx) => {
                        if (idx === index) {
                            return {...action.payload, verbose_fetched: true};
                        } else {
                            return item;
                        }
                    }), suggestionsFetched: false
                }
            } else {
                return {...state, list: [...state.list, {...action.payload, verbose_fetched: true}]}
            }
        case ITEM_TOGGLE_FAVORITE:
            index = state.list.findIndex(item => item.id === action.payload.item.id)
            return {...state, list: state.list.map((item, idx) => {
                if (idx === index) {
                    return {...item, is_favorite: action.payload.value}
                } else {
                    return item;
                }
                })}
        default:
            return state
    }
}