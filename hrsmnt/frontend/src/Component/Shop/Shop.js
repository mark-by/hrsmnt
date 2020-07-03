import React from "react";
import ItemCard from "./ItemCard/ItemCard";
import './Shop.css'
import {useDispatch, useSelector} from "react-redux";
import {fetchItems} from "../../redux/actions";

export default function Shop() {
    const items = useSelector(state => state.shop.list);
    const isFetched = useSelector(state => state.shop.isFetched);
    const loading = useSelector(state => state.app.loading);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (!isFetched)
            dispatch(fetchItems())
    }, [])

   return (
           <main className="container shop">
               {loading && <p>Загрузка...</p>}
               {items.map((item, idx) => {
                   return <ItemCard data={item} key={idx}/>
               })}
           </main>
   );
}