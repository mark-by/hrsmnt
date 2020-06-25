import React from "react";
import '../Auth.css'
import {Link} from "react-router-dom";
import Asterik from "../../Common/Asterik";
import {csrfAxios, inputChangeHandler} from "../../../utils";
import {useHistory} from 'react-router-dom'
import {apiLogin} from "../../../backend/api";
import Input from "../../Common/Input";
import FormError from "../../Common/FormError";

export default function Login(props) {
    const [data, setData] = React.useState({})
    const [errors, setErrors] = React.useState(false)
    const history = useHistory();

    function submitHandler(event) {
        event.preventDefault();
        csrfAxios(apiLogin, data)
            .then(response => {
                if (response.status === 200) {
                    history.push('/');
                }
            })
            .catch(error => setErrors(error.response.data))
    }

    const inputs = [
        {
            label: <>Логин<Asterik/></>,
            required: true,
            type: 'text',
            name: 'username',
            placeholder: '* - Ваш логин',
        },
        {
            label: <>Пароль<Asterik/></>,
            required: true,
            type: 'password',
            name: 'password',
            placeholder: '* - Ваш пароль',
        },
    ]

    return (
        <form className="auth-form" onSubmit={e => submitHandler(e)}>
            <div className="form-grid">
                {data.username ? <div className="greetings">Привет, {data.username}!</div> :
                    <div className="greetings">Приветствуем!</div>}
                {errors && <FormError>{errors['non_field_errors'] ? errors['non_field_errors'] : "Что-то не подходит :/"}</FormError>}
                {inputs.map((input, idx) =>
                    <Input
                        options={input}
                        stateHandler={setData}
                        gridTemplate="80px 1fr"
                        key={idx}
                    />)}
            </div>
            <div className="bottom-wrapper">
                <Link to="/forgot-pass">Забыли пароль?</Link>
                <input type="submit" value="Войти" style={{marginTop: "10px"}}/>
            </div>
            <Link to="/auth/register">Нет аккаунта?</Link>
        </form>
    )
}