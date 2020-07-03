import React from 'react';
import {AddressSuggestions} from "react-dadata";
import './react-dadata.css'

export function Address({filterLocations, inputProps, value, setValue, onChange, hint, gridTemplate}) {
    const onChangeAddressHandler = e => {
        e.persist();
        setValue(prev => ({...prev, value: e.target.value}))
    }

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: gridTemplate ? gridTemplate : "100px 1fr",
            alignItems: "center"
        }}>
            <label>Адрес</label>
            <div>
                <AddressSuggestions token="f5e60d7df1091b7a5b9cc9285e63a456557229c9"
                                    filterLocations={filterLocations ? filterLocations : {country: "*"}}
                                    onChange={onChange ? onChange : setValue}
                                    inputProps={{
                                        ...{
                                            placeholder: "Введите адрес",
                                            required: true,
                                            onChange: e => onChangeAddressHandler(e)
                                        }, ...inputProps
                                    }}
                                    value={value}
                />
                {hint && <p style={{color: "gray", fontSize: "12px", margin: "2px 0 0 10px", position: "absolute"}}>{hint}</p>}
            </div>
        </div>
    )
}