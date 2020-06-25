import React from 'react';
import Header from "./Component/Header/Header";
import {connect} from 'react-redux';
import {Switch, Route, Redirect} from 'react-router-dom'
import Shop from "./Component/Shop/Shop";
import Main from "./Component/Main/Main";
import Item from "./Component/Item/Item";
import Account from "./Component/Account/Account";
import Page404 from "./Component/404Page/404Page";
import Contacts from "./Component/Contacts/Contacts";
import Auth from "./Component/Auth/Auth";
import {isLogged} from "./utils";
import MessageRouter from "./Component/MessagePage/MessageRouter";
import VerifyEmail from "./Component/VerifyEmail";
import Bag from "./Component/Bag/Bag";
import Message from "./Component/Message/Message";
import ForgotPass from "./Component/ForgotPass";
import ConfirmPass from "./Component/ConfirmPass";
import MessagePage from "./Component/MessagePage/MessagePage";
import About from "./Component/About";

function App(props) {
    return (
        <>
            <Header/>
            <Switch>
                <Route exact path="/" component={Main}/>
                <Route path="/shop" component={Shop}/>
                <Route path="/item/:id" component={Item}/>
                <Route path="/account/:tab" component={Account}/>
                <Route path="/auth/:tab" component={Auth}/>
                <Route path="/contacts" component={Contacts}/>
                <Route path="/bag" component={Bag}/>
                <Route path="/verify-email/:key" component={VerifyEmail}/>
                <Route path="/message/:page" component={MessageRouter}/>
                <Route path="/forgot-pass" component={ForgotPass}/>
                <Route path="/reset-password/:uid/:token" component={ConfirmPass}/>
                <Route path="/about" component={About}/>
                <Route component={Page404}/>
            </Switch>
        </>
    );
}

export default connect(
    state => ({
        testStore: state
    }),
    dispatch => ({})
)(App);
