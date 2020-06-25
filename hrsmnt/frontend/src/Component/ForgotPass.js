import React from 'react'
import Input from "./Common/Input";
import Submit from "./Common/Submit";
import {csrfAxios, isLogged} from "../utils";
import {useDispatch, useSelector} from "react-redux";
import {apiResetPassword} from "../backend/api";
import {showMessage} from "../redux/actions";
import {msgTypeFail, msgTypeSuccess} from "./Message/types";

export default function ForgotPass() {
    const userData = useSelector(state => state.user.data);
    const dispatch = useDispatch();
    const [inputData, setInputData] = React.useState({
        email: isLogged() ? userData.email : ''
    });

    function submitHandler(event) {
        event.preventDefault();
        csrfAxios(apiResetPassword, inputData)
            .then(response => {
                if (response.status === 200) {
                    dispatch(showMessage({value: 'Письмо отправлено', type: msgTypeSuccess}))
                }
            })
            .catch(e => dispatch(showMessage({value: 'Что-то не так', type: msgTypeFail})))
    }

    return (
        <main className="container forgot-pass" style={{paddingTop: "30px"}}>
            <h1>Забыли пароль?</h1>
            <p>Мы пришлем вам на почту письмо с сылкой на восстановление пароля</p>
            <form className="form-grid" style={{maxWidth: "500px", marginTop: "20px"}} onSubmit={e => submitHandler(e)}>
                <Input type='email' name="email" value={inputData.email} stateHandler={setInputData} required={true} placeholder="Ваш email" label="Email" gridTemplate="max-content 1fr"/>
                <Submit>Отправить</Submit>
            </form>
        </main>
    )
}