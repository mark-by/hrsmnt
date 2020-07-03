import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {clearBag, disableLoading, paymentCheckStatus, paymentStatus, paymentStop} from "../../redux/actions";
import MessagePage from "./MessagePage";
import {centrifugoHost} from "../../backend/config";
import {Link} from "react-router-dom";

export default function CheckPaymentStatus(props) {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.app.loading);
    const status = useSelector(state => state.payment.status);


    function handler(msg) {
        dispatch(disableLoading());
        paymentStatus(msg.data);
    }

    React.useEffect(() => {
        const Centrifuge = require('centrifuge');
        const cent = new Centrifuge(centrifugoHost);
        cent.setToken(props.match.params.token);
        cent.subscribe(`payment${props.match.params.orderId}`, msg => handler(msg));
        cent.connect();

        dispatch(paymentCheckStatus(props.match.params.orderId))
        dispatch(clearBag());
        dispatch(paymentStop());
    }, [])

    return (
        <MessagePage>
            {loading && <h2>Проверяем статус платежа...</h2>}
            <h3>Номер Вашего заказа: {props.match.params.orderId}</h3>
            {status === 'payment.succeeded' &&
            <>
                <h4>Все отлично! Заказ оплачен</h4>
                <p>Проверьте свой почтовый ящик <span style={{color: "blueviolet"}}>{props.match.params.email}</span>.
                    Мы скоро с Вами свяжемся!</p>
            </>}
            {status === 'payment.canceled' &&
            <>
                <h4>Что-то пошло не так</h4>
                <p>Можете побробовать еще раз <Link to={"/pay-order/" + props.match.params.orderId}
                                                    style={{color: "blueviolet"}}>здесь</Link></p>
            </>}
        </MessagePage>
    )
}