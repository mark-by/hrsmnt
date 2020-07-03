import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {payOrder} from "../../redux/actions";
import MessagePage from "../MessagePage/MessagePage";

export default function PayOrder(props) {
    const loading = useSelector(state => state.app.loading);
    const [msg, setMsg] = React.useState(false);
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(payOrder(props.match.params.orderId, setMsg))
    }, [])

    console.log(msg);
    return (
        <MessagePage>
            {loading && <h3>Подождите...</h3>}
            {msg && <h3>{msg}</h3>}
        </MessagePage>
    )
}
