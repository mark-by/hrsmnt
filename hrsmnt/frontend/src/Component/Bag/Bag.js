import React from "react";
import './Bag.css'
import ItemHistory from "../Account/ItemHistory/ItemHistory";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {deleteItemFromBag} from "../../redux/actions";

const Bag = ({items, deleteItem}) => {
    let total = 0;
    const templateColumns = "repeat(5, 1fr)";
    const columnsGap = "10px";

    if (items.length === 0) {
        return  <main className="container bag"><div className="bag-message">Здесь пусто :(<br/><br/>Добавляйте товары из <Link to="/shop">магазина</Link> в корзину, чтобы потом оформить заказ!</div></main>
    } else {
        return (
            <main className="container bag">
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
                <form>
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
                    <div className="bottom-wrapper">
                        <div>Итог: {total} р</div>
                        <input type="submit" value="Оформить"/>
                    </div>
                </form>
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