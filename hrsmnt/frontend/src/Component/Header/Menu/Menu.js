import React from "react";
import "./Menu.css"
import {Link} from "react-router-dom";
import Cookies from 'js-cookie';

export default function Menu(props) {
    const buttons = [
        {title: "Магазин", isBold: true, link: "/shop"},
        // {title: "Коллекции", isBold: true, link: "/collections"},
        // {title: "Вопросы и ответы", isBold: false, link: "/qa"},
        {title: "Контакты", isBold: false, link: "/contacts"},
        // {title: "Архив", isBold: false, link: "/archive"},
        {title: "О нас", isBold: false, link: "/about"},
    ]
    const account = {title: "Личный кабинет", isBold: false, link: "/account/settings"};
    const auth = {title: "Войти", isBold: false, link: "/auth/login"};
    if (Cookies.get('auth') === '1') {
        buttons.splice(1, 0, account);
    } else {
        buttons.splice(1, 0, auth);
    }

    return (
        <div className="menu-wrapper" onClick={event => {if (event.target.className === "menu-wrapper") props.toggle(false)}}>
            <div className="menu">
                {buttons.map((button, idx) => {
                    return (
                        <Link to={button.link} key={idx} onClick={() => props.toggle(false)}>
                            <div className="menu-item"
                                 style={button.isBold ? {fontWeight: "bold"} : {}}
                                 key={idx}>{button.title}</div>
                        </Link>)
                })}
            </div>
        </div>
    )
}