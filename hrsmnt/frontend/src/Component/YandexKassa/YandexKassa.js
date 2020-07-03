import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {paymentStopLoading} from "../../redux/actions";
import './YandexKassa.css';
import {host} from "../../backend/config";

export default function YandexKassa() {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.payment.loading);
    const dataPayment = useSelector(state => state.payment.data);

    const mountYaKassa = () => {
        dispatch(paymentStopLoading());
        const checkout = new window.YandexCheckout({
            confirmation_token: dataPayment.token,
            return_url: host + '/#/message/check-payment-status/' + dataPayment.email + '/' + dataPayment.orderId + '/' + dataPayment.centToken,
            error_callback(e) {}
        });
        checkout.render('ya-kassa');
    }

    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://kassa.yandex.ru/checkout-ui/v2.js";
        script.onload = () => mountYaKassa();
        document.body.appendChild(script);
    }, [])


    return (
        <main id="ya-kassa">
            {loading && <p style={{color: "white"}}>Загрузка кассы...</p>}
        </main>
    )
}
