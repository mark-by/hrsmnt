import React from "react";
import './ItemHistory.css'
import close from '../../../images/close.svg'

function resize(image, width) {
    return `/resize-img/w${width}${image}`;
}

function srcSet(image) {
    return `${resize(image, 100)}, ${resize(image, 150)} 1.5x, ${resize(image, 200)} 2x`;
}


export default function ItemHistory(props) {
    return (
        <div className="item-history" style={{
            gridTemplateColumns: props.templateColumns,
            gridColumnGap: props.columnGap
        }}>
            <img className="item-history-image" src={resize(props.image, 100)} srcSet={srcSet(props.image)}/>
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
