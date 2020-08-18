import React from 'react'

function Button(props) {

    const buttonStyle = {
        background: props.background ? props.background : "white",
        color: props.color ? props.color : "black",
        width: "max-content",
        padding: "10px 17px",
        borderRadius: "5px",
        boxShadow: props.shadow ? "0 0 7px rgba(164, 164, 164, 1)" : "",
        fontWeight: "500",
        cursor: "pointer",
        margin: "5px 0",
        transform: `scale(${props.scale ? props.scale : 1})`
    }

    return (
        <div style={buttonStyle} onClick={props.onClick}>
            {props.children}
        </div>
    )
}

export default Button