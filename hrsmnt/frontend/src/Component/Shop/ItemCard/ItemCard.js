import React from "react";
import './ItemCard.css'
import {Link} from "react-router-dom";
import {loadImage} from '../../../utils';

export default function ItemCard(props) {
    const [img, setImg] = React.useState(props.data.front_image)

    function resize(width, image) {
        return `/resize-img/w${width}/s20/q70${image}`
    }

    function srcSet(image) {
        return `${resize(330, image)}, ${resize(450, image)} 1.5x, ${resize(660, image)} 2x`;
    }

    loadImage(resize(500, props.data.back_image), srcSet(props.data.back_image));

    return (
        <Link to={"/item/" + props.data.id}>
            <div className="item-card" onMouseEnter={ () => setImg(props.data.back_image)} onMouseLeave={() => setImg(props.data.front_image)}>
                <img className="item-image" src={resize(500, img)} srcSet={srcSet(img)}/>
                <p className="item-title">{props.data.title}</p>
                <div className="item-bottom-wrapper">
                    <div className="item-price">{props.data.price}&nbsp;Р</div>
                    <div className="item-sizes">
                        {props.data.counters.map((size, idx) => {
                            return (
                                <div className="item-size" style={size.is_available ? {color: "black"} : {}} key={idx}>
                                    {size.title}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Link>
    );
}