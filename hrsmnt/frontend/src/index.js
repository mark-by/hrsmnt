import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import {HashRouter} from 'react-router-dom'
import {rootReducer} from "./redux/reducers/rootReducer";
import Message from "./Component/Message/Message";
import Payment from "./Component/Payment/Payment";

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Payment/>
        </HashRouter>
    </Provider>,
    document.getElementById('payment')
)

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Message/>
        </HashRouter>
    </Provider>,
    document.getElementById('message')
)
