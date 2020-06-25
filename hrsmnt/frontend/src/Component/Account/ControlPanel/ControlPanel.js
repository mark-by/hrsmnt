import React from "react";
import "./ControlPanel.css"
import {Link} from "react-router-dom";

export default function ControlPanel(props) {
    const tabs = [
        {title: "Настройки", link: "settings"},
        {title: "Изменить пароль", link: "password"},
        {title: "Мои адреса", link: "address"},
        {title: "Избранное", link: "favorites"},
        {title: "История заказов", link: "orders"},
        {title: "Выход", link: "logout"},
    ]

    return (
        <div className="control-panel" onWheel={event => {
            document.querySelector('.control-panel').scrollBy(event.deltaY, 0)
        }}>
            {tabs.map((tab, idx) => {
                return <Link to={"/account/" + tab.link} key={idx}>
                    <div className={"control-tab" + (tab.link === props.currTab ? " selected" : "")}>
                        {tab.title}
                    </div>
                </Link>
            })}
        </div>
    );
}