import React from "react";
import './Adress.css'
import close from "../../../images/close.svg"
import ItemAddress from "./ItemAddress/ItemAddress";
import {useDispatch, useSelector} from "react-redux";
import {addAddress, deleteAddress, fetchAddresses, resetAddresses, showMessage} from "../../../redux/actions";
import {csrfAxios} from "../../../utils";
import {apiDeleteAddress} from "../../../backend/api";
import {msgTypeFail, msgTypeSuccess} from "../../Message/types";

export default function Address() {
    const dispatch = useDispatch()
    const addresses = useSelector(state => state.address.list)
    const isFetched = useSelector(state => state.address.isFetched)
    const loading = useSelector(state => state.app.loading)
    let [newIsHere, toggleNew] = React.useState(false);
    const [render, setRender] = React.useState(0)

    function rerender() {
        setRender(prevState => prevState++)
    }

    function deleteHandler(address) {
        if (address.new) {
            toggleNew(false)
            dispatch(deleteAddress(address))
        } else {
            csrfAxios(apiDeleteAddress, {id: address.id})
                .then(response => {
                    if (response.status === 200) {
                        dispatch(showMessage({value: "Адресс удален", type: msgTypeSuccess}))
                        dispatch(deleteAddress(address))
                        dispatch(resetAddresses(addresses.filter(addr => addr.id !== address.id)))
                    }
                })
                .catch(e => {
                    dispatch(showMessage({value: "Что-то не так", type: msgTypeFail}))
                })
        }
    }

    if (!isFetched && !loading) {
        dispatch(fetchAddresses())
    }

    let content;
    if (loading) {
        content = <div>Загрузка адресов...</div>
    } else {
        content = addresses.length === 0 ?
            <div>Здесь пусто ;( <br/><br/>Добавляйте адреса доставки, чтобы было удобнее оформлять заказ</div> :
            addresses.map((address,idx) => {
                return (
                    <ItemAddress data={address} key={idx} deleteHandler={() => deleteHandler(address)} toggleNew={toggleNew}/>
                )
            })
    }

    return (
        <div className="account-window address">
            {content}
            <span title="Добавить адрес">
                <img src={close}
                     className="img-button add-button"
                     onClick={() => {
                         if (!newIsHere) {
                             toggleNew(true)
                             dispatch(addAddress())
                         } else {
                             dispatch(showMessage({value: "Сначала сохраните только что созданный адрес"}))
                         }
                     }}/></span>
        </div>
    )
}