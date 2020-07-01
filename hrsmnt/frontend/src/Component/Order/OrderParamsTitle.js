import React from 'react';
import {ok} from "../../images/images";
import {toggleTitle} from "../../utils";

export default function OrderParamsTitle({title, isOpen, selected, checked, dataHandler}) {
    return (
        <h3 onClick={() => toggleTitle(dataHandler)}
            className="order-params-title"
        ><p>{title} <span
            style={{borderColor: "black"}}
            className={isOpen ? "arrow up" : "arrow down"}/></p> {selected &&
        <span style={{color: "gray", fontSize: "14px"}}>{selected}</span>}
            {checked && <img src={ok} alt="ok"/>}
        </h3>
    )
}