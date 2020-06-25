import React from 'react'
import {inputChangeHandler} from "../../utils";
import FormError from "./FormError";

export default function Input(props) {
    let options = {}
    if (props.options) {
        options = props.options;
    } else {
        options = {
            type: props.type,
            name: props.name,
            value: props.value,
            required: props.required,
            placeholder: props.placeholder,
            style: props.style,
            label: props.label
        }
    }

    const containerStyle = {
        display: "grid",
        gridTemplateColumns: props.gridTemplate ? props.gridTemplate : "1fr 1fr",
        alignItems: "center"
    }

    const labelStyle = {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        color: options.readOnly ? "gray" : "black"
    }

    const inputStyle = {
        border: "1px solid " + (props.errors ? "red" : "gray"),
        padding: '2px',
        borderRadius: '2px',
        color: options.readOnly ? "gray" : "black"
    }

    let content = <></>
    switch (options.type) {
        case 'select':
            content = <select name={options.name} onChange={e => inputChangeHandler(e, props.stateHandler)}>
                {options.options.map((option, idx) => {
                    return <option value={option.value}
                                   selected={option.value === options.selected} key={idx}>{option.title}</option>
                })}
            </select>
            break;
        default:
            content = <input type={options.type}
                             name={options.name}
                             required={options.required}
                             defaultValue={options.value}
                             placeholder={options.placeholder}
                             readOnly={options.readOnly}
                             onChange={e => inputChangeHandler(e, props.stateHandler)}
                             style={{...inputStyle, ...props.inputStyle}}
            />
    }

    return (
        <div style={options.style}>
            {props.errors ? props.errors.map((error, idx) => <FormError key={idx}>{error}</FormError>) : <></>}
            <div style={containerStyle}>
                <label style={labelStyle}>{options.label}</label>
                {content}
            </div>
        </div>
    )
}