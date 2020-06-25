import React from "react";
import ItemCard from "./ItemCard/ItemCard";
import './Shop.css'
import {useDispatch, useSelector} from "react-redux";
import {fetchItems} from "../../redux/actions";

export default function Shop() {
    const itemsIsFetched = useSelector(state => state.shop.isFetched);
    const items = useSelector(state => state.shop.list);
    const loading = useSelector(state => state.app.loading);
    const dispatch = useDispatch();

    if (!itemsIsFetched && !loading) {
        dispatch(fetchItems())
    }

   return (
           <main className="container shop">
               {loading && <p>Загрузка...</p>}
               {items.map((item, idx) => {
                   return <ItemCard data={item} key={idx}/>
               })}
           </main>
   );
}