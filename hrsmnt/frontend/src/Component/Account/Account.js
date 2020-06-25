import React from "react";
import "./Account.css"
import ControlPanel from "./ControlPanel/ControlPanel";
import Settings from "./Settings/Settings";
import Password from "./Password/Password";
import {Switch, Route, Redirect} from 'react-router-dom';
import Address from "./Address/Address";
import Orders from "./Orders/Orders";
import Favorites from "./Favorites/Favorites";
import Page404 from "../404Page/404Page";
import Logout from "./Logout/Logout";
import {isLogged} from "../../utils";

export default function Account(props) {
    if (!isLogged()) {
        return <Redirect to="/"/>
    }
    return (
            <main className="container account">
                <ControlPanel currTab={props.match.params.tab}/>
                <Switch>
                    <Route path={"/account/settings"} component={Settings}/>
                    <Route path={"/account/password"} component={Password}/>
                    <Route path={"/account/address"} component={Address}/>
                    <Route path={"/account/orders"} component={Orders}/>
                    <Route path={"/account/favorites"} component={Favorites}/>
                    <Route path={"/account/logout"} component={Logout}/>
                    <Route component={Page404}/>
                </Switch>
            </main>
    );
}
