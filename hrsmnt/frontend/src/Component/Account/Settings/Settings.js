import React from "react";
import './Settings.css'
import {useDispatch, useSelector} from "react-redux";
import {fetchUserData, setUserData, showMessage} from "../../../redux/actions";
import {csrfAxios} from "../../../utils";
import {apiSettings} from "../../../backend/api";
import Input from "../../Common/Input";
import Submit from "../../Common/Submit";
import {msgTypeFail, msgTypeSuccess} from "../../Message/types";

export default function Settings(props) {
    const dispatch = useDispatch();
    const data = useSelector(state => state.user.data)
    const [inputData, setInputData] = React.useState({})
    const [errors, setErrors] = React.useState({})

    const genderOptions = [
        {title: "Мужской", value: "m"},
        {title: "Женский", value: "f"},
        {title: "Предпочитаю не говорить", value: "p"}
    ]

    function submitHandler(event) {
        event.preventDefault();
        csrfAxios(apiSettings, {...data, ...inputData})
            .then(response => {
                if (response.status === 201) {
                    dispatch(setUserData(inputData))
                    dispatch(showMessage({value: "Успешно сохранено", type: msgTypeSuccess}))
                }
            })
            .catch(errors => {
                setErrors(errors.response.data)
                dispatch(showMessage({value: "Есть ошибки", type: msgTypeFail}))
            })
    }

    if (!data.username)
        dispatch(fetchUserData())

    const inputs = [
        {label: 'Имя', required: true, type: 'text', name: 'name', value: data.name, placeholder: 'Ваше имя'},
        {label: 'Логин', required: true, type: 'text', name: 'username', value: data.username},
        {label: 'Email', required: true, type: 'email', name: 'email', value: data.email, readOnly: true},
        {label: 'Пол', type: 'select', name: 'gender', options: genderOptions, selected: data.gender}
    ]
    return (
        <div className="account-window settings">
            <div className="settings-username">{data.username}</div>
            <form onSubmit={event => submitHandler(event)}>
                <div className="settings-main-part">
                    <div className="form-grid">
                        {inputs.map((input, idx) =>
                            <Input options={input}
                                   stateHandler={setInputData}
                                   errors={errors[input.name]}
                                   gridTemplate="50px 1fr"
                                   key={idx}/>)}
                    </div>
                </div>
                <div className="bottom-wrapper row">
                    <Submit>Сохранить</Submit>
                </div>
            </form>
        </div>
    )
}