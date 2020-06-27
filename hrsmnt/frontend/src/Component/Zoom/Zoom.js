import React from 'react';

function Zoom(props, ref) {
    const size = props.size;

    const minY = 80;

    const newX = props.active ? props.left - (size + 20) : 0;
    const newY = props.active ? props.top - (size + 20) : 0;

    const zoomStyle = {
        display: props.active ? "block" : "none",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        position: "fixed",
        left: `${newX}px`,
        top: `${newY < minY ? minY : newY}px`,
        overflow: "hidden",
        zIndex: 20000,
    }
    const imgStyle = {
        position: "absolute",
    }

    return (
        <div className="zoom" style={zoomStyle}>
            <img ref={ref} style={imgStyle} src={props.active ? props.image : ''}/>
        </div>
    )
}

export default React.forwardRef(Zoom);
