import React from "react";
import './Header.css'
import moreButton from "../../images/more.svg"
import bag from "../../images/bag.svg"
import Menu from "./Menu/Menu";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

export default function Header(props) {
    const [menuOpened, toggleMenu] = React.useState(false);
    const bagItems = useSelector(state => state.bag.list);

    return (
        <header>
            <div className="container">
                <div className="header-left-container">
                    <img src={moreButton} alt="menu" className="img-button menu-button"
                         onClick={() => toggleMenu(prev => !prev)}/>
                </div>
                <Link to="/">
                    <div className="logo">HRSMNT</div>
                </Link>
                <div className="header-right-container">
                    {/*<img src={search} alt="search" className="img-button search-button"/>*/}
                    <Link to="/bag">
                        <div className="bag-wrapper">
                            <img src={bag} alt="bag" className="img-button bag-button"/>
                            {bagItems.length > 0 && <div className="bag-counter">{bagItems.length}</div>}
                        </div>
                    </Link>
                </div>
                {menuOpened && <Menu toggle={toggleMenu}/>}
            </div>
        </header>
    );
}