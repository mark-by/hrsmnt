import React from 'react'
import MessagePage from "./MessagePage/MessagePage";
import {csrfAxios, isLogged} from "../utils";
import {Redirect} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {checkEmailToken} from "../redux/actions";

export default function VerifyEmail(props) {
    if (isLogged()) {
        return <Redirect to="/"/>
    }

    const emailToken = useSelector(state => state.user.emailToken)
    const loading = useSelector(state => state.app.loading)
    const dispatch = useDispatch();

    if (!emailToken.isSet && !loading) {
        dispatch(checkEmailToken(props.match.params.key))
    }

    let content;
    if (loading) {
        content = <p>Проверяем токен...</p>
    } else {
        content = emailToken.isValid ? <p>Все отлично! Теперь можете войти.<br/>Приятного шоппинга!</p> : <p>Что-то не сошлось : (</p>
    }

    return(
        <MessagePage>
            <h1>Проверка email</h1>
            {content}
        </MessagePage>
    )
}