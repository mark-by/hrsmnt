import {
    ADD_ADDRESS,
    ADD_FAVORITE,
    ADD_ITEM_TO_BAG, BLUR_APP,
    CHECK_EMAIL_TOKEN, CLEAR_BAG,
    DELETE_ADDRESS, DELETE_BAG_ITEMS,
    DELETE_FAVORITE,
    DELETE_ITEM_FROM_BAG,
    DELETE_USER_DATA, DISABLE_SUGGESTIONS_LOADING, ENABLE_SUGGESTIONS_LOADING,
    END_LOADING,
    FETCH_FAVORITES,
    FETCH_ITEM,
    FETCH_ITEMS, FETCH_ORDER_HISTORY, FETCH_SUGGESTIONS,
    FETCH_USER_DATA,
    HIDE_MESSAGE,
    ITEM_TOGGLE_FAVORITE, PAYMENT_START, PAYMENT_START_LOADING, PAYMENT_STATUS, PAYMENT_STOP, PAYMENT_STOP_LOADING,
    RESTORE_BAG,
    SAVE_ADDRESS,
    SET_ADDRESSES, SET_BAG_PRICE, SET_DELIVERY_PRICE, SET_PROMOCODE,
    SET_USER_DATA,
    SHOW_MESSAGE,
    START_LOADING, UNBLUR_APP,
    UPDATE_ADDRESS
} from "./types";
import axios from 'axios';
import {
    apiActivatePromocode,
    apiAddFavorite, apiCheckBagPrice, apiCheckDeliveryPrice, apiCheckPayment,
    apiGetAddresses,
    apiGetFavorites,
    apiGetItem,
    apiGetItems, apiGetOrderHistory, apiPayOrder, apiSuggestions,
    apiUserData,
    apiVerifyEmail
} from "../backend/api";
import {csrfAxios} from "../utils";
import {msgTypeFail, msgTypeSuccess} from "../Component/Message/types";
import React from "react";


//USER
export const fetchUserData = () => {
    return async dispatch => {
        const response = await axios.get(apiUserData);
        dispatch({type: FETCH_USER_DATA, payload: response.data});
    }
}

export const setUserData = data => ({type: SET_USER_DATA, payload: data})

export const deleteUserData = () => ({type: DELETE_USER_DATA})

export const checkEmailToken = (token) => {
    return async dispatch => {
        dispatch(enableLoading());
        try {
            const response = await csrfAxios(apiVerifyEmail, {key: token});
            if (response.status === 200) {
                dispatch({type: CHECK_EMAIL_TOKEN, payload: true})
            }
        } catch (error) {
            dispatch({type: CHECK_EMAIL_TOKEN, payload: false})
        }
        dispatch(disableLoading())
    }
}

//APP
export const enableLoading = () => ({type: START_LOADING})
export const disableLoading = () => ({type: END_LOADING})
export const hideMessage = () => ({type: HIDE_MESSAGE})
export const showMessage = (options) => {
    return async dispatch => {
        dispatch({type: SHOW_MESSAGE, payload: options})
        setTimeout(() => dispatch(hideMessage()), options.time ? options.time : 2000)
    }
}
export const blur = () => ({type: BLUR_APP});
export const unblur = () => ({type: UNBLUR_APP});


//SHOP
export const fetchItems = () => {
    return async dispatch => {
        dispatch(enableLoading());
        const response = await axios.get(apiGetItems);
        if (response.status === 200) {
            dispatch({type: FETCH_ITEMS, payload: response.data});
        } else {
            dispatch(showMessage({value: 'Что-то не так ;(', type: msgTypeFail}))
        }
        dispatch(disableLoading())
    }
}

export const fetchItem = (id, setError) => {
    return async dispatch => {
        dispatch(enableLoading());
        try {
            const response = await axios.get(apiGetItem, {params: {id: id}});
            if (response.status === 200) {
                dispatch({type: FETCH_ITEM, payload: response.data});
            }
        } catch (e) {
            setError(true);
        }
        dispatch(disableLoading());
    }
}


export const toggleFavoriteItem = (item, value) => ({type: ITEM_TOGGLE_FAVORITE, payload: {item, value}})


//Favorites

export const fetchFavorites = () => {
    return async dispatch => {
        dispatch(enableLoading())
        try {
            const response = await axios.get(apiGetFavorites);
            if (response.status === 200) {
                dispatch({type: FETCH_FAVORITES, payload: response.data});
            }
        } catch (e) {
            dispatch(showMessage({value: "Что-то не так", type: msgTypeFail}));
            dispatch({type: FETCH_FAVORITES, payload: []})
        }
        dispatch(disableLoading());
    }
}

export const addFavorite = (item) => {
    return async dispatch => {
        try {
            const response = await csrfAxios(apiAddFavorite, {id: item.id});
            if (response.status === 200) {
                dispatch({type: ADD_FAVORITE, payload: item});
                dispatch(toggleFavoriteItem(item, true))
            } else if (response.status === 202) {
                dispatch({type: DELETE_FAVORITE, payload: item})
                dispatch(toggleFavoriteItem(item, false))
            }
        } catch (e) {
            dispatch(showMessage({value: "Не удалось добавить", type: msgTypeFail}));
        }
    }
}


export const fetchSuggestion = (item) => {
    return async dispatch => {
        dispatch({type: ENABLE_SUGGESTIONS_LOADING});
        try {
            const response = await axios.get(apiSuggestions, {params: {type: item.type, id: item.id}});
            if (response.status === 200) {
                dispatch({type: FETCH_SUGGESTIONS, payload: response.data});
            }
        } catch (e) {
            dispatch(showMessage({value: "Что-то пошло не так", type: msgTypeFail}))
        }
        dispatch({type: DISABLE_SUGGESTIONS_LOADING});
    }
}

export const paymentStart = (token, orderId, email, centToken) => {
    return async dispatch => {
        dispatch(blur());
        dispatch({type: PAYMENT_START, payload: {token, orderId, email, centToken}})
    }
}

export const paymentStop = () => {
    return async dispatch => {
        dispatch(unblur());
        dispatch({type: PAYMENT_STOP})
    }
}

export const paymentStopLoading = () => ({type: PAYMENT_STOP_LOADING});
export const paymentStatus = (status) => ({type: PAYMENT_STATUS, payload: status});
export const paymentCheckStatus = (orderId) => {
    return async dispatch => {
        dispatch(enableLoading());
        const response = await axios.get(apiCheckPayment, {params: {id: orderId}})
        if (response.data.notified) {
            dispatch(paymentStatus(response.data.status ? "payment.succeeded" : "payment.canceled"));
            dispatch(disableLoading());
        }
    }
}

export const payOrder = (orderId, setMsg) => {
    return async dispatch => {
        dispatch(enableLoading());
        try {
            const response = await axios.get(apiPayOrder, {params: {id: orderId}});
            if (response.status === 200) {
                dispatch(paymentStart(response.data.token, orderId, response.data.email, response.data.cent_token))
            }
        } catch (e) {
            setMsg(e.response.data.error)
        }
        dispatch(disableLoading());
    }
}

export const fetchOrderHistory = () => {
    return async dispatch => {
        dispatch(enableLoading());
        const response = await axios.get(apiGetOrderHistory);
        dispatch({type: FETCH_ORDER_HISTORY, payload: response.data});
        dispatch(disableLoading());
    }
}


export const setBagPrice = (price) => ({type: SET_BAG_PRICE, payload: price});
export const setDeliveryPrice = (price) => ({type: SET_DELIVERY_PRICE, payload: price});

//BAG
export const addItemToBag = (item) => ({type: ADD_ITEM_TO_BAG, payload: item})
export const deleteItemFromBag = (item) => ({type: DELETE_ITEM_FROM_BAG, payload: item})
export const restoreBag = () => {
    return async dispatch => {
        const bag = localStorage.getItem('bag');
        let bagPrice = localStorage.getItem('bagPrice');
        let deliveryPrice = localStorage.getItem('deliveryPrice');
        bagPrice = bagPrice ? bagPrice : 0;
        deliveryPrice = deliveryPrice ? deliveryPrice : 0;
        if (bag) {
            dispatch({type: RESTORE_BAG, payload: {list: JSON.parse(bag), deliveryPrice, bagPrice}});
        } else {
            dispatch({type: RESTORE_BAG, payload: {list: [], deliveryPrice: 0, bagPrice: 0}});
        }
    }
}

export const activatePromocode = (promocode) => {
    return async dispatch => {
        if (!promocode) {
            dispatch(showMessage({value: `Введите промокод`, type: msgTypeFail}));
            return
        }
        try {
            const response = await csrfAxios(apiActivatePromocode, {promocode})
            dispatch(showMessage({
                value: <p><b>Промокод активирован!</b><br/>{response.data.title}<br/><br/>{response.data.description}</p>,
                type: msgTypeSuccess,
                time: 3000
            }));
            dispatch({type: SET_PROMOCODE, payload: {code: promocode, title: response.data.title, description: response.data.description}});
        } catch (err) {
            dispatch(showMessage({value: `${err.response.data.error}`, type: msgTypeFail}));
        }

    }
}

export const deleteBagItems = (items) => ({type: DELETE_BAG_ITEMS, payload: items});
export const clearBag = () => ({type: CLEAR_BAG});


export const checkBagPrice = (items, promocode) => {
    return async dispatch => {
        let data = {items};
        if (promocode) {
            data = {...data, promocode}
        }
        csrfAxios(apiCheckBagPrice, data)
            .then(response => {
                dispatch(setBagPrice(response.data.price));
            })
            .catch()
    }
}

export const checkDeliveryPrice = (delivery_type, country, promocode) => {
    return async dispatch => {
        let data = {delivery_type, country};
        if (promocode) {
            data = {...data, promocode}
        }
        csrfAxios(apiCheckDeliveryPrice, data)
            .then(response => {
                dispatch(setDeliveryPrice(response.data.delivery_price));
            })
            .catch()
    }
}

