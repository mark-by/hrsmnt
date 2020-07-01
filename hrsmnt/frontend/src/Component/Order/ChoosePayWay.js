import React from 'react';
import OrderParamsTitle from "./OrderParamsTitle";
import Input from "../Common/Input";

export default function ChoosePayWay({payWay, setPayWay}) {

    const inputs = [
        {type: "radio", label: "Наличными курьеру", name: "pay_way", value: "cash"},
        {type: "radio", label: "Безналичный расчет", name: "pay_way", value: "card"}
    ]

    return (
        <>
            <OrderParamsTitle title="Выберите способ оплаты" dataHandler={setPayWay}
                              isOpen={payWay.isOpen} selected={payWay.selected}/>

            {payWay.isOpen &&
            inputs.map((options, idx) => (
                <Input options={options} key={idx}
                       gridTemplate="200px 30px"
                       stateHandler={setPayWay}
                       onChange={e => {
                           e.persist();
                           setPayWay(prev => ({...prev, selected: options.label, type: options.value}));
                       }}
                       checked={options.value === payWay.type}
                />
            ))}
        </>
    )
}