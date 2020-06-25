import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Page404 from "../404Page/404Page";
import ThanksForRegistration from "./ThanksForRegistration";
import MessagePage from "./MessagePage";

export default function MessageRouter(props) {
    return (
        <Switch>
            <Route path="/message/thanks-for-registration/:email" component={ThanksForRegistration}/>
            <Route path="/message/success-reset-pass">
                <MessagePage>
                    <h1>Пароль изменен успешно</h1>
                    <p>Теперь можете зайти с новым паролем</p>
                </MessagePage>
            </Route>
            <Route component={Page404}/>
        </Switch>
    )
}