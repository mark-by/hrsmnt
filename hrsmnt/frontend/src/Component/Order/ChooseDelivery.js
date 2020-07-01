import React from 'react';
import OrderParamsTitle from "./OrderParamsTitle";
import Input from "../Common/Input";

export default function ChooseDelivery({delivery, setDelivery}) {

    const deliveryInputs = [
        {label: "Курьером по Москве", type: "radio", name: "delivery_type", value: "courier"},
        {label: "Забрать у м. Киевская", type: "radio", name: "delivery_type", value: "metro"},
        {label: "Почтой России", type: "radio", name: "delivery_type", value: "post"}
    ]

    function deliveryHandler(e, label) {
        e.persist();
        switch (e.target.value) {
            case "courier":
            case "metro":
                setDelivery({selected: label, type: e.target.value, isOpen: false, verboseSelected: true});
                break;
            case "post":
                setDelivery({selected: label, type: e.target.value, isOpen: false, verboseSelected: false});
                break;
        }
    }

    return (
        <>
            <OrderParamsTitle dataHandler={setDelivery}
                              title="Выберите способ доставки" isOpen={delivery.isOpen} selected={delivery.selected}/>
            {delivery.isOpen && deliveryInputs.map((options, idx) => (
                <Input
                    options={options}
                    key={idx}
                    gridTemplate="200px 30px"
                    onChange={e => deliveryHandler(e, options.label)}
                    checked={options.value === delivery.type}/>

            ))}

        </>
    )
}