import React from "react";
import './Favorites.css'
import ItemCard from "../../Shop/ItemCard/ItemCard";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchFavorites} from "../../../redux/actions";

export default function Favorites() {
    const favorites = useSelector(state => state.favorites.list);
    const isFetched = useSelector(state => state.favorites.isFetched);
    const [stateFetched, toggleFetched] = React.useState(false);
    const loading = useSelector(state => state.app.loading);
    const dispatch = useDispatch();

    if (!loading && (!isFetched || !stateFetched)) {
        dispatch(fetchFavorites(toggleFetched));
    }

    if (favorites.length === 0) {
        return <div className="account-window favorites">
            <div className="bag-message">Здесь пусто :|<br/><br/>Добавляйте товары из <Link to="/shop">магазина</Link> в
                избранное, чтобы было удобнее следить за ценой и наличием размеров приглянувшегося товара!
            </div>
        </div>
    } else {
        return (
            <div className="account-window favorites">
                <div className="favorites-list">
                    {favorites.map((item, idx) => {
                        return (
                            <Link to={"/item/" + item.id} key={idx}>
                                <ItemCard data={item}/>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }
}