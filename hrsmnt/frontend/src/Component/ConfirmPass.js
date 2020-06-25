import React from 'react'
import MessagePage from "./MessagePage/MessagePage";
import Input from "./Common/Input";
import Submit from "./Common/Submit";
import {csrfAxios} from "../utils";
import {useHistory} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {showMessage} from "../redux/actions";
import {msgTypeFail} from "./Message/types";
import FormError from "./Common/FormError";
import {apiConfirmPassword} from "../backend/api";

export default function ConfirmPass(props) {
    const [inputData, setInputData] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const dispatch = useDispatch()
    const history = useHistory();

    function submitHandler(event) {
        event.preventDefault();
        csrfAxios(apiConfirmPassword, {...inputData, uid: props.match.params.uid, token: props.match.params.token})
            .then(response => {
                if (response.status === 200) {
                    history.push("/message/success-reset-pass")
                }
            })
            .catch(errors => {
                dispatch(showMessage({value: "Что-то не так", type: msgTypeFail}));
                setErrors(errors.response.data);
            })
    }

    const inputs = [
        {
            label: "Новый пароль",
            type: "password",
            name: "new_password1",
            required: true,
            placeholder: "Введите новый пароль"
        },
        {
            label: "Повторите пароль",
            type: "password",
            name: "new_password2",
            required: true,
            placeholder: "Повторите новый пароль"
        }
    ]

    const gridTemplate = "150px 1fr";

    return (
        <MessagePage>
            <h1>Восстановление пароля</h1>
            <form className="form-grid" onSubmit={e => submitHandler(e)} style={{maxWidth: "500px", marginTop: "20px"}}>
                {inputs.map((input, idx) => (
                    <Input options={input} key={idx} stateHandler={setInputData} errors={errors[input.name]}
                           gridTemplate={gridTemplate}/>
                ))}
                {errors['non_field_errors'] && <FormError>{errors['non_field_errors']}</FormError>}
                <div className="row">
                    <Submit>Изменить</Submit>
                </div>
            </form>
        </MessagePage>
    )
}