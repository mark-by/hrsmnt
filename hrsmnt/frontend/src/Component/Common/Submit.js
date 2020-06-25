import React from 'react'

export default function Submit(props) {
    return (
        <input type="submit" value={props.children} style={props.style}/>
    )
}