import React from "react";
import controlArrow from '../../../images/controlArrow.svg'
import './Slider.css'
import {loadImage} from "../../../utils";

export default function Slider(props) {
    const [currentPos, setCurrentPos] = React.useState(0);

    const image = (number) => {
        return props.images[(currentPos + number) % props.images.length].image;
    }

    function resize(width, number) {
        return `/resize-img/w${width}/q95${image(number)}`
    }

    function srcSet(number) {
        return `${resize(330, number)}, ${resize(450, number)} 1.5x, ${resize(660, number)} 2x`;
    }

    if (props.images) {
        for (let i = 0; i < props.images.length; i++) {
            loadImage(resize(500, i), srcSet(i));
        }
    }

    if (props.images && props.images.length > 0) {
        return (
            <div className="slider row">
                <div className="slider-control"
                     onClick={() => setCurrentPos(
                         prev => Math.abs(props.images.length + prev - 1) % props.images.length
                     )}>
                    <img src={controlArrow} className="img-button"/>
                </div>
                <div className="slider-main-part">
                    <img className="slider-item-image"
                         srcSet={srcSet(0)}
                         src={resize(500, 0)}/>
                    <img className="slider-item-image second-item-image"
                         srcSet={srcSet(1)}
                         src={resize(500, 1)}/>
                </div>
                <div className="slider-control" onClick={() => setCurrentPos(prev => prev + 1)}>
                    <img src={controlArrow} className="img-button" style={{transform: "rotate(180deg)"}}/>
                </div>
            </div>
        )
    } else {
        return <></>
    }
}