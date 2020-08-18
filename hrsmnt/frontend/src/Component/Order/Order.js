import React from 'react';
import Submit from "../Common/Submit";
import './Order.css';
import PostInput from "./PostInput";
import ChooseDelivery from "./ChooseDelivery";
import ChoosePayWay from "./ChoosePayWay";
import DeliveryInfo from "./DeliveryInfo";
import {useDispatch, useSelector} from "react-redux";
import {csrfAxios, isLogged, item_list_to_ids} from "../../utils";
import {apiCreatePayment} from "../../backend/api";
import {
    activatePromocode,
    checkBagPrice,
    checkDeliveryPrice,
    deleteBagItems,
    fetchUserData,
    paymentStart,
    showMessage
} from "../../redux/actions";
import {useHistory} from 'react-router-dom';
import {msgTypeFail} from "../Message/types";
import Input from "../Common/Input";
import Button from "../Common/Button/Button";

export default function Order({bagCost}) {
    const dispatch = useDispatch();
    const items = useSelector(state => state.bag.list)
    const promocode = useSelector(state => state.bag.promocode);
    const bagPrice = useSelector(state => state.bag.bagPrice);
    const deliveryPrice = useSelector(state => state.bag.deliveryPrice);
    const payStarted = useSelector(state => state.payment.started);
    const history = useHistory();
    const userData = useSelector(state => state.user.data);
    React.useEffect(() => {
        if (isLogged() && !userData.email) {
            dispatch(fetchUserData());
        }
    }, [])


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
        email: userData.email,
        tel: '',
        first_name: '',
        second_name: '',
        patronymic: '',
    });

    const [promocodeData, setPromocode] = React.useState({})

    React.useEffect(() => {
        dispatch(checkBagPrice(item_list_to_ids(items), promocode.code))
    }, [items, promocode.code])

    React.useEffect(() => {
        dispatch(checkDeliveryPrice(delivery.type, addressData.data.country, promocode.code))
    }, [delivery.type, addressData.data.country, promocode.code])

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
            promocode: promocode.code
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
            .catch(e => {
                dispatch(showMessage({
                    value: "Некоторые товары уже распроданы. Мы удалили их из корзины.",
                    type: msgTypeFail
                }))
                dispatch(deleteBagItems(e.response.data))
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

            <div className="row" style={{alignItems: "center"}}>
                <Input options={{
                    type: "text",
                    label: "Промокод",
                    name: "promocode",
                    required: false,
                    placeholder: "PROMOCODE"
                }}
                       gridTemplate="80px 130px"
                       stateHandler={setPromocode}
                       value={promocodeData.promocode}
                />
                <Button background="black" color="white" scale={0.8} onClick={() => dispatch(activatePromocode(promocodeData.promocode))}>Активировать</Button>
            </div>

            <div className="row" style={{justifyContent: "space-between", alignItems: "center"}}>
                <p>
                    <b>Итого: {bagPrice} + {deliveryPrice} = {bagPrice + deliveryPrice} р</b>
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
