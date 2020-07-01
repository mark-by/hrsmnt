import React from "react";
import './Bag.css'
import ItemHistory from "../Account/ItemHistory/ItemHistory";
import {Link} from "react-router-dom";
import {connect, useSelector} from "react-redux";
import {deleteItemFromBag} from "../../redux/actions";
import Order from "../Order/Order";

const Bag = ({items, deleteItem}) => {
    let total = 0;
    const templateColumns = "repeat(5, 1fr)";
    const columnsGap = "10px";
    const [orderOpen, toggleOrderOpen] = React.useState(false);
    const payStarted = useSelector(state => state.payment.started);


    if (items.length === 0) {
        return <main className="container bag">
            <div className="bag-message">Здесь пусто :(<br/><br/>Добавляйте товары из <Link to="/shop">магазина</Link> в
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
                            total += item.price;
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
                        <p><b>Итого: {total} р</b></p>
                        <input type="submit" value="Оформить" onClick={() => toggleOrderOpen(true)}/>
                    </div>
                    }
                </div>
                {orderOpen && <Order bagCost={total}/>}
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