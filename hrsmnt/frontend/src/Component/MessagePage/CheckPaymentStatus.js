import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {clearBag, disableLoading, paymentCheckStatus, paymentStop} from "../../redux/actions";
import MessagePage from "./MessagePage";
import {centrifugoHost} from "../../backend/config";
import {Link} from "react-router-dom";

export default function CheckPaymentStatus(props) {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.app.loading);
    const status = useSelector(state => state.payment.status);
    dispatch(clearBag());
    dispatch(paymentStop());

    function handler(msg) {
        dispatch(disableLoading());
    }

    React.useEffect(() => {
        const Centrifuge = require('centrifuge');
        const cent = new Centrifuge(centrifugoHost);
        cent.setToken(props.match.params.token);
        cent.subscribe(`payment${props.match.params.orderId}`, msg => handler(msg));
        cent.connect();
        dispatch(paymentCheckStatus(props.match.params.orderId))
    }, [])

    return (
        <MessagePage>
            <h1>Спасибо за заказ!</h1>
            <p>Номер Вашего заказа: {props.match.params.orderId}</p>
            <p>Проверьте свой почтовый ящик <span style={{color: "blueviolet"}}>{props.match.params.email}</span>. Мы скоро с Вами свяжемся!</p>
            {loading && <p>Проверяем статус платежа...</p>}
            {status === 'payment.succeeded' && <p>Все отлично! Заказ оплачен</p>}
            {status === 'payment.canceled' && <p>Что-то пошло не так. Можете побробовать еще раз <Link to={"/pay-order/" + props.match.params.orderId} style={{color: "blueviolet"}}>здесь</Link></p>}
        </MessagePage>
    )
}