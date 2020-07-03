import React from "react";
import './Orders.css'
import ItemHistory from "../ItemHistory/ItemHistory";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrderHistory} from "../../../redux/actions";

export default function Orders() {
    const orders = useSelector(state => state.user.orders);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchOrderHistory())
    }, [])

    const templateColumns = "repeat(4, 1fr)";
    const columnsGap = "10px";

    function strStatus(status) {
        switch (status) {
            case 'reserved':
                return "Оформлен";
            case 'canceled':
                return "Отменен";
            case 'called':
                return "Созвонились";
            case 'completed':
                return "Завершен";
            case 'returned':
                return "Возвращен";
            case 'on_delivery':
                return 'В пути';
            case 'paid':
                return 'Оплачен';
        }
    }

    if (orders.length === 0) {
        return <div className="account-window orders">
            <div className="bag-message">Здесь пусто :/<br/><br/>Здесь будет отображаться история Ваших заказов</div>
        </div>
    } else {
        return (
            <div className="account-window orders">
                {
                    orders.map((order, idx) => {
                            const datas = order.create_at.slice(0, 10).split('-');
                            return <div className="history-order" key={idx}>
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
                                        return <ItemHistory
                                            templateColumns={templateColumns}
                                            columnGap={columnsGap}
                                            id={item.item.id}
                                            image={item.item.front_image}
                                            title={item.item.title}
                                            size={item.size}
                                            price={item.price}
                                            key={idx}/>
                                    })}
                                </div>
                                <div className="bottom-wrapper" style={{paddingBottom: "5px"}}>
                                    <div>Номер заказа: {order.id}</div>
                                    <div>Статус: {strStatus(order.status)}</div>
                                </div>
                                <div className="bottom-wrapper">
                                    <div>Всего: {order.total_price} р *</div>
                                    <div>Дата: {`${datas[2]}.${datas[1]}.${datas[0].slice(2)}`}</div>
                                </div>
                                <p style={{color: "gray", fontSize: "12px", paddingTop: "5px"}}>* - с учетом доставки</p>
                            </div>
                        }
                    )
                }
            </div>
        )
    }
}