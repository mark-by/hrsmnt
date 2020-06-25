import React from "react";
import './Select.css'

//Параметры:
//options - массив объектов с полями value и title
//title - Название select'a в состоянии, когда ничего не выбрано (если есть secondTitle) (например: "Выберите размер")
//secondTitle - Название select'a в состоянии, когда выбрана какая-либо опция (Опционально) (например: "Выбран размер")
//style - необходимо задать background и width
//name - имя, с которым будет уходить параметр на сервер

export default function Select(props) {
    const [selected, select] = React.useState(null)
    const [isOpen, toggle] = React.useState(false);

    function selectOption(option) {
        props.selectHandler(option)
        select(option)
    }

    return (
        <div className="select" style={props.style} onClick={() => toggle(prev => !prev)}>
            <div className="main-wrapper">
                <p className="select-title">{(selected && props.secondTitle) ? props.secondTitle : props.title}</p>
                {selected && <p>{selected.title}</p>}
                <span className={isOpen ? "arrow up" : "arrow down"}/>
            </div>
            {isOpen && <div className="options">
                {props.options.map((option, idx) => {
                    return <div className="option" key={idx} onClick={() => selectOption(option)}>{option.title}</div>
                })}
            </div>}
            {selected && <input type="hidden" name={props.name} value={selected.value}/>}
        </div>
    )
}