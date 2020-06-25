import React from 'react'
import './SizeGrid.css'
import close from '../../images/close.svg'

export default function SizeGrid(props) {

    function closeHandler(event) {
        console.log(event.target)
        if (event.target.classList.contains("size-grid-wrapper")) {
            props.close()
        }
    }

    return (
        <div className="size-grid-wrapper" onClick={e => closeHandler(e)}>
            <div className="size-grid">
                <div className="size-grid__close-button" onClick={() => props.close()}>
                    <img src={close}/>
                </div>
                <div className="grid"
                    style={{gridTemplateRows: `repeat(${props.parameters[0].values.length + 1}, max-content)`, gridAutoFlow: "column"}}>
                    <div/>
                    {props.parameters[0].values.map(value => (<div className="size-grid__title">{value.size}</div>))}
                    {props.parameters.map(parameter => (
                        <>
                            <div className="size-grid__title">{parameter.title}</div>
                            {parameter.values.map(value => (<div>{value.value}</div>))}
                        </>
                    ))}
                </div>
                <p style={{fontSize: "12px", marginTop: "15px", color: "gray"}}>Размеры в сантиметрах</p>
            </div>
        </div>
    )
}