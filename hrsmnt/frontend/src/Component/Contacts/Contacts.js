import React from "react";
import './Contacts.css'

export default function Contacts() {
    return (
        <main className="container contacts">
            <p className="contacts-title">Социальные сети</p>
            <div className="contacts-wrapper">
                <a href="https://vk.com/hrsmnt_moscow" target="_blank">VK</a>
                <a href="https://instagram.com/hrsmnt_moscow" target="_blank">Instagram</a>
            </div>
            <p className="contacts-title">Телефон</p>
            <div className="contacts-wrapper">
                <a href="tel:+79160373733">+7 916 037-37-33</a>
            </div>
            <p className="contacts-title">Email</p>
            <div className="contacts-wrapper emails">
                <p className="contacts-subtitle">Общие вопросы</p>
                <a href="mailto:hrsmnt@hrsmnt.ru" className="email">hrsmnt@hrsmnt.ru</a>
                <p className="contacts-subtitle">Предложения о сотрудничестве</p>
                <a href="mailto:ap@hrsmnt.ru" className="email">ap@hrsmnt.ru</a>
                <p className="contacts-subtitle">Техническая поддержка</p>
                <a  href="mailto:mb@hrsmnt.ru" className="email">mb@hrsmnt.ru</a>
            </div>
        </main>
    )
}