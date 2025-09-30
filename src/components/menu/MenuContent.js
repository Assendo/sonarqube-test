import React, { Component } from "react";
// eslint-disable-next-line
import { BrowserRouter as Route, Redirect, Link } from "react-router-dom";
import MenuOptions from "./MenuOptions";
import { userService } from '../../_services';
import { anyTypeAnnotation } from "@babel/types";

class MenuContent extends Component {
    constructor(props){
        super(props);

        this.state = {
            Menu: [],
            user: {
                id: 0,
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                authdata: ""
            }
        }

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        const requestInfoPost = {
            method: 'POST',
            body: `string`,
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        const requestInfoGet = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        this.state.user.username = JSON.parse(localStorage.getItem('user'));
        console.log("[MenuContent.js] this.state.user : " + this.state.user.username);

        console.log("[MenuContent.js] this.props.LocalHost : " + this.props.LocalHost);

        //DESARROLLO
        //fetch(this.props.LocalHost + '/sta/application/usuario/consulta/pbustos', requestInfo)
        fetch(this.props.LocalHost + '/sta/application/usuario/consulta/'+this.state.user.username, requestInfoPost, { mode: 'cors' }) 
        .then(response => response.json())
        .then(data => {
            console.log("[MenuContent.js] data.codigoPerfil: " + data.codigoPerfil);
            this.setState({usuario: {...this.state.usuario, codigoPerfil: data.codigoPerfil}});
            console.log(this.props.LocalHost + '/sta/application/menu/'+this.state.usuario.codigoPerfil);
            fetch(this.props.LocalHost + '/sta/application/menu/'+this.state.usuario.codigoPerfil, requestInfoGet, {mode:"cors"})
            //fetch(this.props.LocalHost + '/sta/application/menu/1', {mode:"cors"})
            .then(response => response.json())
            .then(registros => {
                this.setState({Menu: registros})
            })
            .catch(console.log);
        })
        .catch(console.log);
    }

    handleClick() {
        userService.logout();
        window.location.replace(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+"/login");
    }

    handleClickMonitoreo() {
        window.location.replace(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+"/monitoreo");
    }
    
    render(){
        const menuComponent = this.state.Menu.map(item => <MenuOptions key={item.Code} item={item}/>);
        return(
            <div className="sidebar-left">
                {menuComponent}
                <div className="menu-option">
                    <Link onClick={this.handleClickMonitoreo} to="javascript:void(0)">Monitoreo</Link>
                </div>
                <div className="menu-exit">
                    <Link onClick={this.handleClick} to="javascript:void(0)">Salir</Link>
                </div>
            </div>
        )
    }
}

export default MenuContent;