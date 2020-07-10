import React from 'react';
import {discount} from "../../images/images";
import './Discount.css';
import Window from "../Common/Window/Window";

export default function Discount() {
    const [open, toggle] = React.useState(false);
    if (!open) {
        return( <div className="discount" onClick={e => toggle(true)}><img src={discount} alt="discount description"/></div> );
    } else {
        return(
            <Window close={() => toggle(false)}>
                <p>До 00.07.20 бесплатная доставка</p>
            </Window>)
    }
}