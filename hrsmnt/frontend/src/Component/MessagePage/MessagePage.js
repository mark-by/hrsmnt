import React from 'react'

export default function MessagePage(props) {
    return (
        <main className="container" style={{padding: "30px 0"}}>
            {props.children}
        </main>
    )
}