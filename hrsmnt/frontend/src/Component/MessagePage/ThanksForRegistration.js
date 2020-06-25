import React from 'react'
import MessagePage from "./MessagePage";

export default function ThanksForRegistration(props) {
    return (
        <MessagePage>
            <h1>Спасибо за регистрацию!</h1>
            <p>Проверьте свой почтовый ящик <span style={{color: "blueviolet"}}>{props.match.params.email}</span> для подтверждения аккаунта :)</p>
        </MessagePage>
    )
}