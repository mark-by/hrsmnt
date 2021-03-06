import React from "react";
import Slider from "./Slider/Slider";
import Select from "../Common/Select/Select";
import './Item.css'
import star from '../../images/star.svg'
import fillStar from '../../images/fillStar.svg'
import Suggestions from "./Suggestions/Suggestions";
import {useDispatch, useSelector} from "react-redux";
import {addFavorite, addItemToBag, checkBagPrice, fetchItem, showMessage} from "../../redux/actions";
import {Link, Redirect} from 'react-router-dom';
import MessagePage from "../MessagePage/MessagePage";
import {msgTypeFail, msgTypeSuccess} from "../Message/types";
import SizeGrid from "../SizeGrid/SizeGrid";
import {isLogged, item_list_to_ids} from "../../utils";

export default function Item(props) {
    const [sizeSelected, selectSize] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [sizeGridIsOpen, toggleSizeGrid] = React.useState(false);
    const dispatch = useDispatch();
    const items = useSelector(state => state.shop.list)
    const loading = useSelector(state => state.app.loading);
    const bagItems = useSelector(state => state.bag.list)
    const promocode = useSelector(state => state.bag.promocode);

    React.useEffect(() => {
        dispatch(checkBagPrice(item_list_to_ids(bagItems), promocode.code))
    }, [bagItems, promocode.code])


    const index = items.findIndex(item => item.id == props.match.params.id)
    let item = {images: [], counters: []};
    if (index >= 0) {
        item = items[index]
    }
    if (!loading && (index === -1 || !item.verbose_fetched)) {
        dispatch(fetchItem(props.match.params.id, setError));
    }
    const isFavorite = !!item.is_favorite;

    function addToBag(item) {
        if (sizeSelected) {
            if (bagItems.findIndex(el => el.id === item.id && el.size === sizeSelected.title) !== -1) {
                dispatch(showMessage({value: "Товар уже в корзине", type: msgTypeFail}))
            } else {
                dispatch(addItemToBag({...item, size: sizeSelected.title}));
                dispatch(showMessage({value: "Товар добавлен в корзину", type: msgTypeSuccess}))
            }
        } else {
            dispatch(showMessage({
                value: "Размер не выбран. Выберите нужный Вам размер, чтобы добавить товар в корзину",
                time: 3000,
                type: msgTypeFail
            }))
        }
    }

    if (error) {
        return <Redirect to="/page400"/>
    }
    if (loading) {
        return (
            <MessagePage>
                <p>Загрузка...</p>
            </MessagePage>
        )
    }

    function addFavoriteHandler(item) {
        if (!isLogged()) {
            dispatch(showMessage({
                value: <>Необходимо авторизоваться, чтобы добавить товар в избранное --> <Link to="/auth/login" style={{color: "blueviolet"}}>Войти</Link></>,
                type: msgTypeFail,
                time: 4000
            }))
        } else {
            dispatch(addFavorite(item))
        }
    }

    let selectOptions = []
    item.counters.forEach(size => {
        if (size.is_available) {
            selectOptions.push({title: size.title, value: size.title})
        }
    })

    return (
        <main className="container item">
            {sizeGridIsOpen && <SizeGrid parameters={item.parameters} type={item.type} close={() => toggleSizeGrid(false)}/>}
            <div className="item-main-page-wrapper">
                <Slider images={item.images}/>
                <div className="right-part">
                    <div className="item-main-info-part-wrapper">
                        <div className="item-main-info-part">
                            <div className="item-title">{item.title}</div>
                            <div className="row item-top-wrapper">
                                <p>{item.type}</p>
                                <div className="item-price">{item.price}&nbsp;Р</div>
                            </div>
                        </div>
                        <div className="item-control-part">
                            {(selectOptions.length > 0 || item.counters > 0) &&
                            <Select options={item.counters}
                                    title="Выберите размер"
                                    secondTitle="Выбран размер"
                                    name="size"
                                    style={{
                                        background: "#ababab",
                                        width: "250px"
                                    }}
                                    selectHandler={selectSize}/>}
                            <div className="row item-main-wrapper">
                                {selectOptions.length > 0 ?
                                    <div className="button black" onClick={() => addToBag(item)}>Добавить в корзину</div> :
                                    <div className="button" style={{background: "gray", color: "white"}}>Распродано</div>
                                }
                                <img src={isFavorite && isLogged() ? fillStar : star} className="img-button" alt="добавить в избранное" onClick={() => addFavoriteHandler(item)}/>
                            </div>
                            {item.parameters && item.parameters.length > 0 ? <div className="button" style={{
                                background: "#ababab",
                                color: "white",
                            }} onClick={() => toggleSizeGrid(true)}
                            >Размерная сетка</div> : <></>}

                        </div>
                    </div>
                    <div className="item-about-part">
                        <div className="title-about">О товаре</div>
                        <div className="item-about" dangerouslySetInnerHTML={{__html: item.description}}/>
                    </div>
                </div>
            </div>
            {item.verbose_fetched ? <Suggestions item={item}/> : ""}
        </main>
    )
}

