import React from 'react';
import OrderParamsTitle from "./OrderParamsTitle";
import {Address} from "./Address";
import Input from "../Common/Input";

export default function DeliveryInfo({
                                         deliveryVerbose, setDeliveryVerbose,
                                         metroCheck, courierCheck, type, addressData,
                                         setAddressData, postData, setPostData
                                     }) {
    return (
        <>
            <OrderParamsTitle title="Информация для доставки" dataHandler={setDeliveryVerbose}
                              checked={type === 'metro' ? metroCheck : courierCheck}/>
            {deliveryVerbose.isOpen &&
            <>
                {type === 'courier' &&
                <Address value={addressData} gridTemplate="80px 250px" setValue={setAddressData} filterLocations={{city: "Москва"}}/>
                }
                <Input type="tel" name="tel" label="Телефон" placeholder="Любой формат"
                       hint="Нужен, чтобы договориться о дате и времени"
                       value={postData.tel}
                       stateHandler={setPostData}
                       gridTemplate="80px 1fr" style={{maxWidth: "550px"}}
                       required={true}/>
                <Input options={{
                    type: "email",
                    label: "Email",
                    name: "email",
                    required: true,
                    placeholder: "Email"
                }}
                       gridTemplate="80px 250px"
                       stateHandler={setPostData}
                       value={postData.email}
                       hint="Нужен для сообщения статуса заказа"
                />
            </>}
        </>
    )
}