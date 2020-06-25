import React from "react";
import {Route, Switch, Redirect} from 'react-router-dom';
import Page404 from "../404Page/404Page";
import Login from "./Login/Login";
import Register from "./Register/Register";
import {isLogged} from "../../utils";

export default function Auth(props) {
    if (isLogged())
        return <Redirect to="/"/>
    return (
        <main className="container auth">
            <Switch>
                <Route path={"/auth/login"} component={Login}/>
                <Route path={"/auth/register"} component={Register}/>
                <Route component={Page404}/>
            </Switch>
        </main>
    )
}
