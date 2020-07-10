import React from 'react';
import './Window.css';
import close from "../../../images/close.svg";

export default function Window(props) {

    function closeHandler(e) {
        if (e.target.className === 'window-wrapper') {
            props.close();
        }
        if (props.closeHandler)
            props.closeHandler(e);
    }

    return (
        <div className="window-wrapper" onClick={e => closeHandler(e)}>
            <div className="window">
                <div className="window__close-button" onClick={() => props.close()}>
                    <img src={close} alt="close button"/>
                </div>
                    {props.children}
            </div>
        </div>
    )
}