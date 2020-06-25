import React from "react";
import './ItemHistory.css'
import close from '../../../images/close.svg'

export default function ItemHistory(props) {
    return (
        <div className="item-history" style={{
            gridTemplateColumns: props.templateColumns,
            gridColumnGap: props.columnGap
        }}>
            <img className="item-history-image" src={props.image}/>
            <input type="hidden" value={props.id} name="id"/>
            <div className="item-history-title">{props.title}</div>
            <input type="hidden" value={props.title} name="title"/>
            <div className="item-history-size">{props.size}</div>
            <input type="hidden" value={props.size.value} name="size"/>
            {props.price && <p>{props.price}</p>}
            {props.closeHandler && <img src={close}
                                        className="img-button"
                                        onClick={()=>props.closeHandler()}/>}
        </div>
    )
}
