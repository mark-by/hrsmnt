import {combineReducers} from "redux";
import {bagReducer} from "./bagReducer";
import {userReducer} from "./userReduser";
import {appReducer} from "./appReducer";
import shopReducer from "./shopReducer";
import favoritesReducer from "./favoritesReducer";
import suggestionsReducer from "./suggestionsReducer";
import paymentReducer from "./paymentReducer";

export const rootReducer = combineReducers({
    bag: bagReducer,
    user: userReducer,
    app: appReducer,
    shop: shopReducer,
    favorites: favoritesReducer,
    suggestions: suggestionsReducer,
    payment: paymentReducer
})