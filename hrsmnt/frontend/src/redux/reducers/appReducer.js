import {
    BLUR_APP,
    END_LOADING,
    HIDE_MESSAGE,
    NONE_DISPLAY_MESSAGE,
    SHOW_MESSAGE,
    START_LOADING,
    UNBLUR_APP
} from "../types";

const initialState = {
    loading: false,
    message: {value: '', isShowed: false, display: "none"},
    blured: false
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_LOADING:
            return {...state, loading: true}
        case END_LOADING:
            return {...state, loading: false}
        case SHOW_MESSAGE:
            return {...state, message: {...action.payload, isShowed: true}}
        case HIDE_MESSAGE:
            return {...state, message: {...state.message, isShowed: false}}
        case BLUR_APP:
            return {...state, blured: true};
        case UNBLUR_APP:
            return {...state, blured: false};
        default:
            return state;
    }
}