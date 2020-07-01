import React from 'react';
import OrderParamsTitle from "./OrderParamsTitle";
import Input from "../Common/Input";
import {AddressSuggestions} from "react-dadata";
import {Address} from "./Address";

export default function PostInput({postData, addressData, setPostData, setAddressData, checked}) {

    const changeAddressHandler = value => {
        setAddressData(value);
        setPostData(prevState => ({...prevState, postal_code: value.data.postal_code}))
    }


    const postInputs = [
        {label: "Фамилия", name: "second_name", required: true, type: "text", placeholder: "Фамилия"},
        {label: "Имя", name: "first_name", required: true, type: "text", placeholder: "Имя"},
        {label: "Отчество", name: "patronymic", required: false, type: "text", placeholder: "Отчество (если есть)"},
        {label: "Телефон", name: "tel", type: "tel", required: true, placeholder: "Любой формат"},
    ]

    const postalCodeChangeHandler = e => {
        e.persist();
        setAddressData(prev => ({...prev, data: {postal_code: e.target.value}}))
    }

    return (
        <>
            <OrderParamsTitle title="Информация для почты" dataHandler={setPostData}
                              isOpen={postData.isOpen}
                              checked={checked}
            />
            {postData.isOpen &&
            <>
                <p style={{color: "gray", fontSize: "12px"}}>* При заказе почтой оплата только безналичным способом</p>
                <p style={{color: "gray", fontSize: "12px"}}>* По России - 350р, по СНГ и Украине - 650р</p>
                <div className={"row"} style={{flexWrap: "wrap"}}>
                    <div className="form-grid" style={{width: "unset"}}>
                        {postInputs.map((options, idx) => (
                            <Input options={options} key={idx} stateHandler={setPostData} value={postData[options.name]}
                                   gridTemplate="100px 250px"/>
                        ))}
                    </div>
                    <div className="geo form-grid" style={{width: "unset"}}>
                        <Address value={addressData} setValue={setAddressData} onChange={changeAddressHandler}
                                 hint="Не забудьте указать квартиру"/>
                        <Input label='Почтовый индекс' type="number" name="postal_code"
                               value={addressData.data.postal_code}
                               placeholder="Почтовый индекс"
                               onChange={e => postalCodeChangeHandler(e)} required={true} gridTemplate="100px 250px"/>
                    </div>
                </div>
                <Input options={{
                    type: "email",
                    label: "Email",
                    name: "email",
                    required: true,
                    placeholder: "Email"
                }}
                       gridTemplate="100px 250px"
                       stateHandler={setPostData}
                       value={postData.email}
                       hint="Нужен для сообщения статуса заказа"
                />
            </>
            }
        </>
    )
}