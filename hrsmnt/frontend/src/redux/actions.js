import {
    ADD_ADDRESS,
    ADD_FAVORITE,
    ADD_ITEM_TO_BAG,
    CHECK_EMAIL_TOKEN,
    DELETE_ADDRESS,
    DELETE_FAVORITE,
    DELETE_ITEM_FROM_BAG,
    DELETE_USER_DATA, DISABLE_SUGGESTIONS_LOADING, ENABLE_SUGGESTIONS_LOADING,
    END_LOADING,
    FETCH_FAVORITES,
    FETCH_ITEM,
    FETCH_ITEMS, FETCH_SUGGESTIONS,
    FETCH_USER_DATA,
    HIDE_MESSAGE,
    ITEM_TOGGLE_FAVORITE,
    RESTORE_BAG,
    SAVE_ADDRESS,
    SET_ADDRESSES,
    SET_USER_DATA,
    SHOW_MESSAGE,
    START_LOADING,
    UPDATE_ADDRESS
} from "./types";
import axios from 'axios';
import {
    apiAddFavorite,
    apiGetAddresses,
    apiGetFavorites,
    apiGetItem,
    apiGetItems, apiSuggestions,
    apiUserData,
    apiVerifyEmail
} from "../backend/api";
import {csrfAxios} from "../utils";
import {msgTypeFail} from "../Component/Message/types";

//BAG
export const addItemToBag = (item) => ({type: ADD_ITEM_TO_BAG, payload: item})
export const deleteItemFromBag = (item) => ({type: DELETE_ITEM_FROM_BAG, payload: item})
export const restoreBag = () => {
    return async dispatch => {
        const bag = localStorage.getItem('bag');
        if (bag) {
            dispatch({type: RESTORE_BAG, payload: JSON.parse(bag)});
        } else {
            dispatch({type: RESTORE_BAG, payload: []});
        }
    }
}

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

export const fetchAddresses = () => {
    return async dispatch => {
        dispatch(enableLoading());
        try {
            const response = await axios.get(apiGetAddresses)
            if (response.status === 200) {
                dispatch({type: SET_ADDRESSES, payload: response.data})
            }
        } catch (e) {

        }
        dispatch(disableLoading())
    }
}

export const addAddress = () => ({type: ADD_ADDRESS})
export const updateAddress = (address) => ({type: UPDATE_ADDRESS, payload: address})
export const deleteAddress = (address) => ({type: DELETE_ADDRESS, payload: address})
export const resetAddresses = (addresses) => {
    return async dispatch => {
        console.log(addresses)
        dispatch({type: SET_ADDRESSES, payload: []})
        dispatch({type: SET_ADDRESSES, payload: addresses})
    }
}
export const saveAddress = (address, id) => ({type: SAVE_ADDRESS, payload: {...address, new: false, id: id}})


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

export const fetchFavorites = (setFetched) => {
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
        setFetched(true);
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

