import {PAYMENT_START, PAYMENT_START_LOADING, PAYMENT_STATUS, PAYMENT_STOP, PAYMENT_STOP_LOADING} from "../types";

const init = {
    started: false,
    loading: false,
    status: false,
    data: {}
}

export default function paymentReducer(state = init, action) {
    switch (action.type) {
        case PAYMENT_START:
            return  {started: true, loading: true, data: action.payload}
        case PAYMENT_START_LOADING:
            return {...state, loading: true}
        case PAYMENT_STOP:
            return {started: false, loading: false}
        case PAYMENT_STOP_LOADING:
            return {...state, loading: false}
        case PAYMENT_STATUS:
            return {...state, status: action.payload}
        default:
            return state;
    }
}