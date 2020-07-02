import React from 'react';
import Submit from "../Common/Submit";
import './Order.css';
import PostInput from "./PostInput";
import ChooseDelivery from "./ChooseDelivery";
import ChoosePayWay from "./ChoosePayWay";
import DeliveryInfo from "./DeliveryInfo";
import {useDispatch, useSelector} from "react-redux";
import {csrfAxios} from "../../utils";
import {apiCreatePayment} from "../../backend/api";
import {paymentStart} from "../../redux/actions";
import {useHistory} from 'react-router-dom';

export default function Order({bagCost}) {
    const dispatch = useDispatch();
    const items = useSelector(state => state.bag.list)
    const payStarted = useSelector(state => state.payment.started);
    const history = useHistory();

    const [delivery, setDelivery] = React.useState({
        selected: false,
        type: false,
        isOpen: true,
    })

    const [addressData, setAddressData] = React.useState(
        {value: '', data: {postal_code: '', country: '', city: ''}}
    )

    const [deliveryVerbose, setDeliveryVerbose] = React.useState({
        isOpen: true,
    })

    const [payWay, setPayWay] = React.useState({
        isOpen: true,
    })

    const [postData, setPostData] = React.useState({
        isOpen: true,
        email: '',
        tel: '',
        first_name: '',
        second_name: '',
        patronymic: '',
    });

    const postFilled = postData.first_name && postData.second_name && postData.tel &&
        addressData.value && addressData.data.postal_code && postData.email;

    const verboseDeliveryCourierFilled = postData.tel && addressData.value && postData.email;
    const verboseDeliveryMetroFilled = postData.tel && postData.email;

    const submitHandler = e => {
        e.preventDefault();
        csrfAxios(apiCreatePayment, {
            items: items.map(item => ({id: item.id, size: item.size})),
            delivery_type: delivery.type,
            email: postData.email,
            tel: postData.tel,
            pay_way: delivery.type === 'post' ? "card" : payWay.type,

            first_name: postData.first_name,
            second_name: postData.second_name,
            patronymic: postData.patronymic,
            city: (delivery.type === 'metro' || delivery.type === 'courier') ? 'Москва' : addressData.data.city,
            country: (delivery.type === 'metro' || delivery.type === 'courier') ? 'Россия' : addressData.data.country,
            postal_code: (delivery.type === 'metro' || delivery.type === 'courier') ? 0 : addressData.data.postal_code,
            address: addressData.value,
        })
            .then(response => {
                if (response.status === 200) {
                    if (payWay.type === 'cash') {
                        history.push('/message/thanks-for-order/' + postData.email + '/' + response.data.order_id)
                    }
                    if (payWay.type === 'card' || delivery.type === 'post') {
                        dispatch(paymentStart(response.data.token, response.data.order_id, postData.email, response.data.cent_token));
                    }
                }
            })
    }

    return (
            <form className="form-grid order"
                  style={{paddingTop: "10px", marginTop: "10px", borderTop: "1px solid gray"}}
                  autoComplete={false} onSubmit={e => submitHandler(e)}>
                <ChooseDelivery delivery={delivery} setDelivery={setDelivery}/>

                {delivery.type === 'post' &&
                <PostInput addressData={addressData} postData={postData} setAddressData={setAddressData}
                           setPostData={setPostData} checked={postFilled}/>
                }

                {(delivery.type === 'metro' || delivery.type === 'courier') &&
                <DeliveryInfo type={delivery.type}
                              postData={postData}
                              setPostData={setPostData}
                              addressData={addressData}
                              setAddressData={setAddressData}
                              deliveryVerbose={deliveryVerbose}
                              setDeliveryVerbose={setDeliveryVerbose}
                              courierCheck={verboseDeliveryCourierFilled}
                              metroCheck={verboseDeliveryMetroFilled}
                />
                }

                {((delivery.type === 'metro' && verboseDeliveryMetroFilled) || (delivery.type === 'courier' && verboseDeliveryCourierFilled)) &&
                <ChoosePayWay payWay={payWay} setPayWay={setPayWay}/>
                }

                <div className="row" style={{justifyContent: "space-between", alignItems: "center"}}>
                    <p>
                        <b>Итого: {bagCost + ((delivery.type === 'post' && addressData.data.country) ? (addressData.data.country === 'Россия' ? 350 : 650) : 0)} р</b>
                    </p>

                    {(delivery.type === 'post' && postFilled) &&
                    <Submit>Оплатить</Submit>
                    }
                    {((delivery.type === 'courier' && verboseDeliveryCourierFilled) || (delivery.type === 'metro' && verboseDeliveryMetroFilled)) &&
                    <>
                        {(payWay.type === 'card' && !payStarted) &&
                        <Submit>Оплатить</Submit>
                        }
                        {payWay.type === 'cash' &&
                        <Submit>Оформить</Submit>
                        }
                    </>
                    }
                </div>
            </form>
    )
}
