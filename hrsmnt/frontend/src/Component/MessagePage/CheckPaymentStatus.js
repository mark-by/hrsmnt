import React from 'react';
import {useDispatch} from "react-redux";
import {clearBag, paymentStop} from "../../redux/actions";
import MessagePage from "./MessagePage";
import {centrifugoHost} from "../../backend/config";

export default function CheckPaymentStatus(props) {
    const dispatch = useDispatch();
    // dispatch(clearBag());
    dispatch(paymentStop());

    function handler(msg) {
        console.log(msg);
    }

    React.useEffect(() => {
        const Centrifuge = require('centrifuge');
        const cent = new Centrifuge(centrifugoHost + '/connection/websocket');
        cent.setToken(props.match.params.token);
        cent.subscribe(`payment${props.match.params.orderId}`, msg => handler(msg));
        cent.connect();
    }, [])

    return (
        <MessagePage>
            <h1>Спасибо за заказ!</h1>
            <p>Номер Вашего заказа: {props.match.params.orderId}</p>
            <p>Проверьте свой почтовый ящик <span style={{color: "blueviolet"}}>{props.match.params.email}</span>. Мы скоро с Вами свяжемся!</p>
        </MessagePage>
    )
}