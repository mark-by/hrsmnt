import {DISABLE_SUGGESTIONS_LOADING, ENABLE_SUGGESTIONS_LOADING, FETCH_SUGGESTIONS} from "../types";

const initialState = {
    list: [],
    isFetched: false,
    loading: false,
}

export default function suggestionsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_SUGGESTIONS:
            return {list: action.payload, isFetched: true}
        case ENABLE_SUGGESTIONS_LOADING:
            return {...state, loading: true}
        case DISABLE_SUGGESTIONS_LOADING:
            return {...state, loading: false}
        default: return state;
    }
}