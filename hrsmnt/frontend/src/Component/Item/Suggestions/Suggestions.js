import React from "react";
import './Suggestions.css'
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchSuggestion} from "../../../redux/actions";

export default function Suggestions(props) {
    const items = useSelector(state => state.suggestions.list);
    const loading = useSelector(state => state.suggestions.loading);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchSuggestion(props.item))
    }, [props.item]);

    if (loading) {
        return (
            <div className="suggestions">
                <p>Загрузка...</p>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return '';
    }

    return (
        <div className="suggestions">
            <div className="suggestions-title">Вам также может понравиться</div>
            <div className="suggestions-container">
                {items.map((item, idx) => {
                    return (
                        <Link to={"/item/" + item.id} key={idx}>
                            <div className="suggestion-item">
                                <img className="suggestion-item-image" src={`/resize-img/w200${item.front_image}`}
                                     srcSet={`/resize-img/w200${item.front_image}, /resize-img/w250${item.front_image} 1.5x, /resize-img/w300${item.front_image} 2x`}/>
                                <div className="suggestion-item-title">{item.title}</div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}