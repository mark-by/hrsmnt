import React from 'react'
import MessagePage from "./MessagePage";
import {useDispatch} from "react-redux";
import {clearBag, paymentStop} from "../../redux/actions";
import {isLogged} from "../../utils";

export default function ThanksForOrder(props) {
    const dispatch = useDispatch();
    dispatch(clearBag());
    dispatch(paymentStop());

    return (
        <MessagePage>
            <h1>Спасибо за заказ!</h1>
            <p>Номер Вашего заказа: {props.match.params.orderId}</p>
            <p>Проверьте свой почтовый ящик <span style={{color: "blueviolet"}}>{props.match.params.email}</span>. Мы скоро с Вами свяжемся!</p>
            <p>Вы можете следить за статусом заказа в своем личном
                кабинете {!isLogged() && `(для этого нужно авторизоваться или зарегистрироваться с почтой ${props.match.params.email})`}</p>
        </MessagePage>
    )
}