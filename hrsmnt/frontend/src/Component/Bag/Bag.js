import React from "react";
import './Bag.css'
import ItemHistory from "../Account/ItemHistory/ItemHistory";
import {Link} from "react-router-dom";
import {connect, useDispatch, useSelector} from "react-redux";
import {checkBagPrice, deleteItemFromBag} from "../../redux/actions";
import Order from "../Order/Order";
import Discount from "../Discount/Discount";
import {item_list_to_ids} from "../../utils";

const Bag = ({items, deleteItem}) => {
    const templateColumns = "repeat(5, 1fr)";
    const columnsGap = "10px";
    const [orderOpen, toggleOrderOpen] = React.useState(false);
    const payStarted = useSelector(state => state.payment.started);
    const bagPrice = useSelector(state => state.bag.bagPrice);
    const dispatch = useDispatch();
    const promocode = useSelector(state => state.bag.promocode);

    React.useEffect(() => {
        if (!orderOpen) {
            dispatch(checkBagPrice(item_list_to_ids(items), promocode.code))
        }
    }, [items])

    if (items.length === 0) {
        return <main className="container bag">
            <div className="bag-message">Вы пока ничего не добавили в корзину :(<br/><br/>Добавляйте товары из <Link to="/shop">магазина</Link> в
                корзину, чтобы потом оформить заказ!
            </div>
        </main>
    } else {
        return (
            <main className="container bag" style={{zIndex: payStarted ? "10000" : "0"}}>
                <div className="bag-window-title" style={{
                    gridTemplateColumns: templateColumns,
                    gridColumnGap: columnsGap
                }}>
                    <p>Товар</p>
                    <p>Навание</p>
                    <p>Размер</p>
                    <p>Цена</p>
                    <p>Удалить</p>
                </div>
                <div className="content-bag">
                    <div className={"bag-list"}>
                        {items.map((item, idx) => {
                            return <ItemHistory
                                templateColumns={templateColumns}
                                columnGap={columnsGap}
                                id={item.id}
                                image={item.front_image}
                                title={item.title}
                                size={item.size}
                                price={item.price}
                                closeHandler={() => deleteItem(item)}
                                key={idx}/>
                        })}
                    </div>
                    {!orderOpen &&
                    <div className="bottom-wrapper">
                        <p><b>Итого: {bagPrice} р</b></p>
                        <input type="submit" value="Оформить" onClick={() => toggleOrderOpen(true)}/>
                    </div>
                    }
                </div>
                {orderOpen && <Order/>}

            </main>
        )
    }
}

const mapStateToProps = state => ({
    items: state.bag.list
})

const mapDispatchToProps = {
    deleteItem: deleteItemFromBag
}

export default connect(mapStateToProps, mapDispatchToProps)(Bag)