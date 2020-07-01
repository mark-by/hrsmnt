import React from "react";
import close from '../../../../images/close.svg'
import {AddressSuggestions} from "react-dadata";
import 'react-dadata/dist/react-dadata.css';
import {csrfAxios, inputChangeHandler} from "../../../../utils";
import {apiSaveAddress, apiUpdateAddress} from "../../../../backend/api";
import {useDispatch} from "react-redux";
import {saveAddress, showMessage, updateAddress} from "../../../../redux/actions";
import {msgTypeFail, msgTypeSuccess} from "../../../Message/types";
import {ok} from "../../../../images/images";

export default function ItemAddress(props) {
    const dispatch = useDispatch()
    const [inputData, setInputData] = React.useState({
        title: props.data.title,
        value: props.data.value,
        apartment: props.data.apartment,
        postal_code: props.data.postal_code
    })
    const [value, setValue] = React.useState({value: props.data.value, data: {postal_code: props.data.postal_code}});

    function submitHandler(event) {
        event.preventDefault();
        let url;
        let postal_code;
        if (value.data) {
            postal_code = value.data.postal_code ? value.data.postal_code : inputData.postal_code
        } else {
            postal_code = inputData.postal_code
        }
        let data = {
            title: inputData.title,
            postal_code: postal_code,
            apartment: inputData.apartment,
            value: value.value ? value.value : inputData.value
        }
        if (props.data.new) {
            url = apiSaveAddress
        } else {
            url = apiUpdateAddress
            data['id'] = props.data.id
        }

        csrfAxios(url, data)
            .then(response => {
                if (response.status === 201) {
                    dispatch(saveAddress(data, response.data.id))
                    props.toggleNew(false);
                    dispatch(showMessage({value: "Адрес успешно сохранен", type: msgTypeSuccess}))
                } else if (response.status === 200) {
                    dispatch(updateAddress(data))
                    dispatch(showMessage({value: "Адрес успешно изменен", type: msgTypeSuccess}))
                }
            })
            .catch(e => {
                dispatch(showMessage({value: "Что-то не так", type: msgTypeFail}))
            })
    }

    const onChangeInput = value => {
        setValue(value)
        if (value.data.postal_code) {
            setInputData(prevState => ({...prevState, postal_code: value.data.postal_code}))
        }
    }

    const inputStyle = {marginLeft: "0", fontSize: "16px", marginBottom: "5px"}
    return (
        <form className="address-wrapper" onSubmit={event => submitHandler(event)}>
            <div className="input-wrapper">
                <input autoComplete={false} required={true} style={inputStyle} type="text"
                       placeholder="Введите название адреса"
                       name="title" value={inputData.title} onChange={e => inputChangeHandler(e, setInputData)}/>
                <AddressSuggestions token="f5e60d7df1091b7a5b9cc9285e63a456557229c9" value={value} onChange={onChangeInput}
                                    inputProps={{placeholder: "Введите адрес дома", required: true, name: 'value', onChange:e => inputChangeHandler(e, setInputData) }}/>
                <input required={true} style={{...inputStyle, marginTop: "5px"}} type="number"
                       placeholder="Введите индекс" onChange={e => inputChangeHandler(e, setInputData)}
                       name="postal_code" value={inputData.postal_code ? inputData.postal_code : value.data.postal_code}/>
                <input style={{...inputStyle, marginBottom: "0"}} type="number"
                       placeholder="Введите номер квартиры (необязательно)" name="apartment"
                       value={inputData.apartment ? inputData.apartment : ""}
                       onChange={e => inputChangeHandler(e, setInputData)}/>
            </div>
            <span title="Сохранить"><input type="submit" value="" style={{
                background: `url(${ok})`,
                backgroundColor: "unset"
            }}
                                           className="img-button"/></span>
            <span title="Удалить"><img src={close} className="img-button close-button"
                                       onClick={() => props.deleteHandler()}/></span>
        </form>
    )
}