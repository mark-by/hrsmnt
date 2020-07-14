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

    function handleSelectOption(option) {
        if (option.is_available) {
            selectOption(option)
            toggle(false);
        }
    }

    function closeHandler(e) {
        if (e.target.className === "select" ||
            e.target.className === "main-wrapper" ||
            e.target.className === "select-title" ||
            e.target.classList.contains("arrow")
        ) {
            toggle(prev => !prev)
        }
    }

    return (
        <div className="select" style={props.style} onClick={e => closeHandler(e)}>
            <div className="main-wrapper">
                <p className="select-title">{(selected && props.secondTitle) ? props.secondTitle : props.title}</p>
                {selected && <p>{selected.title}</p>}
                <span className={isOpen ? "arrow up" : "arrow down"}/>
            </div>
            {isOpen && <div className="options">
                {props.options.map((option, idx) => {
                    return <div className={"option" + (!option.is_available ? " not-available" : "")} key={idx} onClick={() => handleSelectOption(option)}>
                        <p>{option.title}</p>
                        {option.status && <div className="status">{option.status}</div>}
                    </div>
                })}
            </div>}
            {selected && <input type="hidden" name={props.name} value={selected.title}/>}
        </div>
    )
}