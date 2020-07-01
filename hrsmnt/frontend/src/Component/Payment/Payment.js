import React from 'react';
import {useSelector} from "react-redux";
import YandexKassa from "../YandexKassa/YandexKassa";

export default function Payment() {
    const paymentIsOpen = useSelector(state => state.payment.started);
    const dataPayment = useSelector(state => state.payment.data);
    return (
       <>
           {paymentIsOpen && <YandexKassa token={dataPayment.token} email={dataPayment.email} orderId={dataPayment.orderId} centToken={dataPayment.token}/>}
       </>
    )
}