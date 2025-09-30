import React, { Component } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";
import MenuContent from '../menu/MenuContent';
import Main from "./Main";
import Banco from "../banco/Banco";
import Clase from "../clase/Clase";
import Glosa from "../glosa/Glosa";
import Directorio from "../directorio/Directorio";
import Usuario from "../usuario/Usuario";
import Operacion from "../operacion/Operacion";
import Parametro from "../parametro/Parametro";
import Tipotransaccion from "../transaccion/Tipotransaccion";
import Feriado from "../feriado/Feriado"
import Archivo from "../archivo/Archivo";
import ArchivosProcesado from "../procesado/ArchivosProcesado";
import ArchivosRechazado from "../rechazados/ArchivosRechazado";
import ArchivosEnviados from "../enviados/ArchivosEnviados";
import Cuadratura from "../cuadratura/Cuadratura";
import { userService } from '../../_services';
import * as data from '../../components/properties.json';

//export default class Login extends Component {

export default class Content extends Component{
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            users: [],
            LocalHost: window.webserver //"http://localhost:8080"
        };
    }

    componentDidMount() {
        console.log("window.webserver : " + window.webserver);

        this.setState({ 
            user: JSON.parse(localStorage.getItem('user')),
            users: { loading: true }
        });
    }

    render(){
        const { user, users } = this.state;
        return(
            <div>
                <Router>
                    <MenuContent LocalHost={this.state.LocalHost} />
                    <Switch>
                        <Route path="/blank" component={Main} LocalHost={this.state.LocalHost} />
                        <Route path="/usuario" render={() => <Usuario LocalHost={this.state.LocalHost} />} />
                        <Route path="/banco" render={() => <Banco LocalHost={this.state.LocalHost} />} />
                        <Route path="/clase" render={() => <Clase LocalHost={this.state.LocalHost} />} />
                        <Route path="/glosa" render={() => <Glosa LocalHost={this.state.LocalHost} />} />
                        <Route path="/directorio" render={() => <Directorio LocalHost={this.state.LocalHost} />} />
                        <Route path="/operacion" render={() => <Operacion LocalHost={this.state.LocalHost} />} />
                        <Route path="/parametro" render={() => <Parametro LocalHost={this.state.LocalHost} />} />
                        <Route path="/transaccion" render={() => <Tipotransaccion LocalHost={this.state.LocalHost} />} />
                        <Route path="/feriado" render={() => <Feriado LocalHost={this.state.LocalHost} />} />
                        <Route path="/archivo" render={() => <Archivo LocalHost={this.state.LocalHost} />} />
                        <Route path="/procesado" render={() => <ArchivosProcesado LocalHost={this.state.LocalHost} />} />
                        <Route path="/rechazo" render={() => <ArchivosRechazado LocalHost={this.state.LocalHost} />} />
                        <Route path="/enviado" render={() => <ArchivosEnviados LocalHost={this.state.LocalHost} />}/>
						<Route path="/cuadratura" render={() => <Cuadratura LocalHost={this.state.LocalHost} />}/>
                    </Switch>
                </Router>
            </div>
        )
    }
}

//export default Content;