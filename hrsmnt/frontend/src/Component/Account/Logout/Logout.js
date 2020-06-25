import React from 'react';
import {csrfAxios} from "../../../utils";
import {useHistory} from 'react-router-dom'
import {apiLogout} from "../../../backend/api";
import {useDispatch} from "react-redux";
import {deleteUserData} from "../../../redux/actions";

export default function Logout() {
    const history = useHistory();
    const dispatch = useDispatch();

    function logoutHandler() {
        csrfAxios(apiLogout)
            .then(response => {
                if (response.status === 200) {
                    dispatch(deleteUserData())
                    history.push('/');
                }
            })
    }

    return (
        <div className="account-window address">
            <div className="bag-message" style={{marginBottom: '30px'}}>Досвидания : (</div>
            <input type="submit" value="Выйти" onClick={() => logoutHandler()}/>
        </div>
    )
}