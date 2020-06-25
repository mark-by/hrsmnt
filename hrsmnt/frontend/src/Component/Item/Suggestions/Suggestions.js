import React from "react";
import './Suggestions.css'
import {Link} from "react-router-dom";

export default function Suggestions() {
    const data = [
        {id: 1, image: "green", title: "Green"},
        {id: 2, image: "yellow", title: "Yell"},
        {id: 3, image: "black", title: "Blackie"},
        {id: 4, image: "blue", title: "Bluups"},
        {id: 5, image: "orange", title: "Ora"},
    ]

    return (
        <div className="suggestions">
            <div className="suggestions-title">Вам также может понравиться</div>
            <div className="suggestions-container">
                {data.map((item, idx) => {
                    return (
                        <Link to={"/item/" + item.id} key={idx}>
                            <div className="suggestion-item">
                                <div className="suggestion-item-image" style={{background: item.image}}/>
                                <div className="suggestion-item-title">{item.title}</div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}