import React, {useRef} from "react";
import controlArrow from '../../../images/controlArrow.svg'
import './Slider.css'
import {inputChangeHandler, loadImage} from "../../../utils";
import Zoom from "../../Zoom/Zoom";

export default function Slider(props) {
    const [currentPos, setCurrentPos] = React.useState(0);
    const [zoom, toggleZoom] = React.useState({active: false, left: 0, top: 0, image: ''});
    const [zoomSettings, setZoomSettings] = React.useState(localStorage.getItem('zoomSettings') ? JSON.parse(localStorage.getItem('zoomSettings')) : {
        size: 30,
        zoom: 40
    });
    const [zoomSettingsIsOpen, toggleZoomSettings] = React.useState(false);
    const [zoomImage, setZoomImage] = React.useState(false);

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

    const zoomedImageRef = useRef(null);

    function zoomStart(e, image) {
        e.persist();
        const x = e.pageX;
        const y = e.pageY;
        const offsetX = e.nativeEvent.offsetX;
        const offsetY = e.nativeEvent.offsetY;
        const zoomKoef = (zoomSettings.zoom / 10);
        const zoomSize = 10 * zoomSettings.size;
        toggleZoom(prev=> ({...prev, left: x, top: y, size: zoomSize, image: image}))
        const width = e.target.naturalWidth * zoomKoef;
        zoomedImageRef.current.width = width;
        zoomedImageRef.current.style.left = `-${(zoomedImageRef.current.width / e.target.width) * offsetX - zoomSize / 2}px`;
        zoomedImageRef.current.style.top = `-${(zoomedImageRef.current.height / e.target.height) * offsetY - zoomSize / 2}px`;
    }

    function zoomStop() {
        toggleZoom(prev => ({...prev, active: false}))
    }

    function handlerImageZoom(image) {
        setZoomImage(image);
        zoomStop()
    }

    if (props.images && props.images.length > 0) {
        return (
            <div className="slider-wrapper">
                {zoomImage && <div
                    onClick={() => handlerImageZoom()}
                    style={{
                        position: "fixed",
                        top: "50px",
                        left: "0",
                        right: "0",
                        bottom: "0",
                        background: "rgba(0, 0, 0, 0.7)",
                        zIndex: "15000",
                        display: "flex",
                        justifyContent: "center",
                        cursor: "zoom-out"
                    }}><img src={zoomImage}
                            onMouseEnter={e => toggleZoom(prev => ({...prev, active: true}))}
                            onMouseMove={e => zoomStart(e, zoomImage)}
                            onMouseLeave={e => zoomStop(e)}
                            style={{
                        height: "100%"
                }}/></div>}
                <Zoom active={zoom.active} left={zoom.left} top={zoom.top} image={zoom.image} size={zoom.size}
                      ref={zoomedImageRef}/>
                <div className="slider row">
                    <div className="slider-control"
                         onClick={() => setCurrentPos(
                             prev => Math.abs(props.images.length + prev - 1) % props.images.length
                         )}>
                        <img src={controlArrow} className="img-button"/>
                    </div>
                    <div className="slider-main-part">
                        {[0, 1].map(idx => (
                            <img className={"slider-item-image" + (idx === 1 ? " second-item-image" : "")}
                                 srcSet={srcSet(idx)}
                                 src={resize(500, idx)}
                                 onMouseEnter={e => toggleZoom(prev => ({...prev, active: true}))}
                                 onMouseMove={e => {
                                     zoomStart(e, image(idx))
                                 }}
                                 onMouseLeave={e => {
                                     zoomStop(e)
                                 }}
                                 onClick={() => handlerImageZoom(image(idx))}
                                 key={idx}
                            />
                        ))}
                    </div>
                    <div className="slider-control" onClick={() => setCurrentPos(prev => prev + 1)}>
                        <img src={controlArrow} className="img-button" style={{transform: "rotate(180deg)"}}/>
                    </div>
                </div>
                <div className="zoom-control">
                    <div style={{paddingTop: "20px", color: "gray", cursor: "pointer"}}
                         onClick={() => toggleZoomSettings(prev => !prev)}>Настройки зума
                    </div>
                    {zoomSettingsIsOpen && <div className="row" style={{
                        justifyContent: "space-around",
                        maxWidth: "550px",
                        paddingTop: "25px"
                    }}>
                        <div className="row">
                            <label>Увеличение:</label>
                            <input type="range" min="20" max="100" name="zoom" value={zoomSettings.zoom}
                                   onChange={e => inputChangeHandler(e, setZoomSettings, 'zoomSettings')}/>
                        </div>
                        <div className="row">
                            <label>Размер:</label>
                            <input type="range" min="15" max="50" name="size" value={zoomSettings.size}
                                   onChange={e => inputChangeHandler(e, setZoomSettings, 'zoomSettings')}/>
                        </div>
                    </div>}

                </div>
            </div>
        )
    } else {
        return <></>
    }
}