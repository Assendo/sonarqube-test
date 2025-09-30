import React, { Component } from 'react';
import HeaderMonitoreo from '../header/HeaderMonitoreo';
import * as data from '../../components/properties.json';

import {
    Table,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap';
//npm install --save bootstrap
//npm install --save reactstrap react react-dom
//npm start

class ListArchivosMonitoreo extends Component {
    state = {
        model: {
            pag: 1,
            pagCant: 5
        }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }


    listar = (NumPagina) => {
        //this.props.ListarPagina(this.state.model.pag);
        this.props.ListarPagina(NumPagina);
    }

    pagxtot = 0;
    onTotPag = (xpag) => {
        this.pagxtot = xpag;
    }

    render() {
        const { archivosMonitoreos } = this.props;

        //const elements = ['1', '2', '3'];
        //elements.push('9');
        const elements = [];

        this.props.archivosMonitoreos.slice(0, 1).map((archivosMonitoreo, i) => (
            //console.log("Pagina de render : " + archivosRechazado.cantPags)
            this.onTotPag(archivosMonitoreo.cantPags)
        ))

        const pi = this.pagxtot;
        console.log(" pi : " + pi);

        //array
        for (let i = 0; i < this.pagxtot; i++) {
            console.log(i);
            let pag = i;
            pag = pag + 1;
            elements.push("" + pag + "");
        }

        return (
            <div>
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Fecha Hora</th>
                            <th>Usuario</th>
                            <th>Acción</th>
                            <th>Archivo</th>
                            <th>Estado</th>
                            <th>ID Proceso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.archivosMonitoreos.map((archivosMonitoreo, i) => (
                                <tr key={i}>
                                    <td>{archivosMonitoreo.fechaHora}</td>
                                    <td>{archivosMonitoreo.codigoUsuario}</td>
                                    <td align="left">{archivosMonitoreo.accion}</td>
                                    <td align="left">{archivosMonitoreo.nombreArchivo}</td>
                                    <td>{archivosMonitoreo.estadoArchivo}</td>
                                    <td>{archivosMonitoreo.idProceso}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}


export default class ArchivosMonitoreo extends Component {

    state = {
        archivosMonitoreos: [],
        message: {
            text: '',
            alert: ''
        },
        LocalHost: window.webserver
    }

    UrlLista = this.state.LocalHost + '/sta/application/archivo/consulta/monitoreo/';

    componentDidMount() {
        this.Listar(1);
    }

    Listar = () => {
        const requestInfoGet = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };
		
        fetch(this.UrlLista, requestInfoGet, { mode: 'cors' })
            .then(response => response.json())
            .then(archivosMonitoreos => this.setState({ archivosMonitoreos }))
            .catch(e => console.log(e));
    }

    render() {
        return (
            <div>
            <script type="text/JavaScript">
            function timedRefresh() {
            setTimeout("location.reload(true);",10000)
            }
            </script>
            <div className="mainMonitoreo">
                <div >
                    <div >
                        <ListArchivosMonitoreo ListarPagina={this.Listar} archivosMonitoreos={this.state.archivosMonitoreos} />
                    </div>
                </div>
            </div>
            </div>
        );
    }
}