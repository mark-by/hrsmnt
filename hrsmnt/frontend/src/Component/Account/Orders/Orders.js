import React from "react";
import './Orders.css'
import ItemHistory from "../ItemHistory/ItemHistory";

export default function Orders(props) {
    const orders = [
        {
            date: "22.06.20", items: [
                {id: 1, image: "green", title: "SPRAY", price: 6000, size: "M"},
                {id: 2, image: "black", title: "Vova", price: 2500, size: "S"},
                {id: 3, image: "gray", title: "Hate", price: 2200, size: "L"},
            ]
        },
        {
            date: "23.06.20", items: [
                {id: 1, image: "green", title: "SPRAY", price: 6000, size: "M"},
                {id: 2, image: "black", title: "Vova", price: 2500, size: "S"},
            ]
        },
    ]

    const templateColumns = "repeat(4, 1fr)";
    const columnsGap = "10px";


    if (orders.length === 0) {
        return <div className="account-window orders">
            <div className="bag-message">Здесь пусто :/<br/><br/>Здесь будет отображаться история Ваших заказов</div>
        </div>
    } else {
        return (
            <div className="account-window orders">
                {
                    orders.map((order, idx) => {
                            let total = 0;
                            return <div className="history-order">
                                <div className="bag-window-title" style={{
                                    gridTemplateColumns: templateColumns,
                                    gridColumnGap: columnsGap
                                }}>
                                    <p>Товар</p>
                                    <p>Навание</p>
                                    <p>Размер</p>
                                    <p>Цена</p>
                                </div>
                                <div className={"bag-list"}>
                                    {order.items.map((item, idx) => {
                                        total += item.price;
                                        return <ItemHistory
                                            templateColumns={templateColumns}
                                            columnGap={columnsGap}
                                            id={item.id}
                                            image={item.image}
                                            title={item.title}
                                            size={item.size}
                                            price={item.price}
                                            key={idx}/>
                                    })}
                                </div>
                                <div className="bottom-wrapper">
                                    <div>Всего: {total} р</div>
                                    <div>Дата: {order.date}</div>
                                </div>
                            </div>
                        }
                    )
                }
            </div>
        )
    }
}