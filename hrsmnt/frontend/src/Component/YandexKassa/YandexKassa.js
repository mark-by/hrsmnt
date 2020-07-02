import React, {useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {paymentStopLoading} from "../../redux/actions";
import './YandexKassa.css';
import {host} from "../../backend/config";

export default function YandexKassa({token, orderId, email, centToken}) {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.payment.loading);

    const mountYaKassa = () => {
        dispatch(paymentStopLoading());
        const checkout = new window.YandexCheckout({
            confirmation_token: token, //Токен, который перед проведением оплаты нужно получить от Яндекс.Кассы
            return_url: host + '/#/message/check-payment-status/' + email + '/' + orderId + '/' + centToken, //Ссылка на страницу завершения оплаты
            error_callback(error) {
                //Обработка ошибок инициализации
            }
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
