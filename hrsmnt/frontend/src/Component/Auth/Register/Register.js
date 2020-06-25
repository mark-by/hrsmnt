import React from "react";
import Asterik from "../../Common/Asterik";
import {Link} from "react-router-dom";
import {csrfAxios, inputChangeHandler} from "../../../utils";
import {apiRegister} from "../../../backend/api";
import {useHistory} from 'react-router-dom'
import Input from "../../Common/Input";
import Submit from "../../Common/Submit";
import FormError from "../../Common/FormError";

export default function Register(props) {
    const [data, setData] = React.useState({})
    const [errors, setErrors] = React.useState({})
    const history = useHistory();

    function submitHandler(event) {
        event.preventDefault();
        csrfAxios(apiRegister, data)
            .then(response => {
                if (response.status === 201) {
                    history.push('/message/thanks-for-registration/' + data.email);
                }
            })
            .catch(errors => setErrors(errors.response.data))
    }

    const inputs = [
        {
            label: <>Логин<Asterik/></>,
            required: true,
            type: "text",
            name: "username",
            placeholder: "* - Ваш логин",
        },
        {
            label: <>Email<Asterik/></>,
            required: true,
            type: "email",
            name: "email",
            placeholder: "* - Ваша почта",
        },
        {
            label: <>Пароль<Asterik/></>,
            required: true,
            type: "password",
            name: "password1",
            placeholder: "* - Ваш пароль",
        },
        {
            label: <>Повторите<Asterik/></>,
            required: true,
            type: "password",
            name: "password2",
            placeholder: "* - Повторите Ваш пароль",
        },
    ]

    return (
        <form className="auth-form" onSubmit={e => submitHandler(e)}>
            <div className="form-grid">
                {data.username ? <div className="greetings">Привет, {data.username}!</div> :
                    <div className="greetings">Приветствуем!</div>}
                {inputs.map((input, idx) =>
                    <Input
                        options={input}
                        errors={errors[input.name]}
                        stateHandler={setData}
                        gridTemplate="90px 1fr"
                        key={idx}
                    />)}
                {errors['non_field_errors'] && <FormError>{errors['non_field_errors']}</FormError>}
            </div>
            <Submit style={{marginTop: "10px"}}>Зарегистрироваться</Submit>
            <Link to="/auth/login">Уже есть аккаунт?</Link>
        </form>
    )
}