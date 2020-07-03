import React from 'react';
import {useSelector} from "react-redux";
import YandexKassa from "../YandexKassa/YandexKassa";

export default function Payment() {
    const paymentIsOpen = useSelector(state => state.payment.started);
    return (
       <>
           {paymentIsOpen && <YandexKassa/>}
       </>
    )
}