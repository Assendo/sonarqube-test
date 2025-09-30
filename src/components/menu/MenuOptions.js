import React from "react";
// eslint-disable-next-line
import { BrowserRouter as Route, Link } from "react-router-dom";

function MenuOptions(props){
    if(props.item.tipo){
        return(MenuTitle(props));
    }else{
        return(MenuOption(props));
    }
}

function MenuOption(props){
    return(
        <div className="menu-option">
            <Link to={props.item.url}>{props.item.descripcion}</Link>
        </div>
    )
}

function MenuTitle(props){
    return(
        <div className="menu-title">
            {props.item.descripcion}
        </div>
    )
}

export default MenuOptions;