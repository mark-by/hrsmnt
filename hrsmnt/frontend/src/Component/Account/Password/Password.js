import React from "react";
import './Password.css'
import {Link} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {fetchUserData, showMessage} from "../../../redux/actions";
import Input from "../../Common/Input";
import FormError from "../../Common/FormError";
import {csrfAxios} from "../../../utils";
import {apiChangePassword} from "../../../backend/api";
import {msgTypeFail, msgTypeSuccess} from "../../Message/types";

export default function Password() {
    const data = useSelector(state => state.user.data);
    const [inputData, setInputData] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (!data.username)
            dispatch(fetchUserData())
    }, []);

    function submitHandler(event) {
        event.preventDefault();
        csrfAxios(apiChangePassword, inputData)
            .then(response => {
                if (response.status === 200) {
                    dispatch(showMessage({value: "Пароль успешно изменен", type: msgTypeSuccess}))
                }
            })
            .catch(errors =>{
                setErrors(errors.response.data)
                dispatch(showMessage({value: "Есть ошибки", type: msgTypeFail}))
            })
    }

    const inputs = [
        {label: "Старый пароль", required: true, type: "password", name: "old_password"},
        {label: "Новый пароль", required: true, type: "password", name: "new_password1"},
        {label: "Повторите", required: true, type: "password", name: "new_password2"},
    ]

    return (
        <div className="account-window password-window">
            <div className="settings-username">{data.username}</div>
            <form onSubmit={event => submitHandler(event)}>
                <div className="settings-main-part">
                    {inputs.map((input, idx) => (
                        <Input
                            options={input}
                            stateHandler={setInputData}
                            errors={errors[input.name]}
                            gridTemplate="130px 1fr"
                            key={idx}
                        />
                    ))}
                    {errors['non_field_errors'] && <FormError>{errors['non_field_errors']}</FormError>}
                </div>
                <div className="bottom-wrapper row">
                    <Link to={"/forgot-pass"}>Забыли пароль?</Link> <input type="submit" value="Сохранить"/>
                </div>
            </form>
        </div>
    )
}