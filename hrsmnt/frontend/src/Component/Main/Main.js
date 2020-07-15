import React from "react";

import './Main.css'
// import Discount from "../Discount/Discount";

class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

export default function Main() {
    const [deg, setDeg] = React.useState({x: 0, y: 0});
    const center = new Point(window.innerWidth / 2, window.innerHeight / 2);

    document.onmousemove = event => setDeg({x: (event.pageY - center.y) / 90, y: -(event.pageX - center.x) / 90});
    document.ontouchmove = event => setDeg({
        x: (event.changedTouches[0].pageY - center.y) / 10,
        y: -(event.changedTouches[0].pageX - center.x) / 10
    });

    const resize = "/resize-img/w700/q95"

    const firstLayer = "/media/index/layer3.png"
    const secondLayer = "/media/index/layer2.png"
    const thirdLayer = "/media/index/layer1.png"

    return (
        <>
            {/*<Discount/>*/}
            <style>{`
            @-webkit-keyframes rotate {
                from {
                    -webkit-transform: translate(-50%, -50%) rotateX(0deg) rotateY(-10deg);
                }
                to {
                    -webkit-transform: translate(-50%, -50%) rotateX(0deg) rotateY(360deg);
                }
            }
            
            html, body {
                height: 100vh;
                overflow: hidden;
            }
            `}</style>
            <div className="wrap">
                <div className="parent animated"
                     style={{transform: 'translate(-50%, -50%) rotateX(' + deg.x + 'deg) rotateY(' + deg.y + 'deg)'}}>
                    <div className="box1"><img src={firstLayer} onDragStart={() => {
                    }} alt="words"/></div>
                    <div className="box2"><img src={secondLayer} onDragStart={() => {
                    }} alt="frame"/></div>
                    <div className="box3"><img src={thirdLayer} onDragStart={() => {
                    }} alt="frame"/></div>
                </div>
            </div>
        </>
    )
}