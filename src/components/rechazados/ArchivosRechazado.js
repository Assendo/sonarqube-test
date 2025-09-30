import React, { Component } from 'react';

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

class ListArchivosRechazados extends Component {
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
        const { archivosRechazados } = this.props;

        //const elements = ['1', '2', '3'];
        //elements.push('9');
        const elements = [];

        this.props.archivosRechazados.slice(0, 1).map((archivosRechazado, i) => (
            //console.log("Pagina de render : " + archivosRechazado.cantPags)
            this.onTotPag(archivosRechazado.cantPags)
        ))

        const pi = this.pagxtot;

        //array
        for (let i = 0; i < this.pagxtot; i++) {
            console.log(i);
            let pag = i;
            pag = pag + 1;
            elements.push("" + pag + "");
        }

        return (
            <div>
                <h5 align="left">Paginas:</h5>
                    {elements.map((value, index) => {
                        return <button key={index} onClick={() => this.listar(value)}>
                                {value}
                            </button>
                    })}
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Fecha Hora</th>
                            <th>Usuario</th>
                            <th>Acción</th>
                            <th>Archivo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.archivosRechazados.map((archivosRechazado, i) => (
                                <tr key={i}>
                                    <td>{archivosRechazado.fechaHora}</td>
                                    <td>{archivosRechazado.codigoUsuario}</td>
                                    <td>{archivosRechazado.accion}</td>
                                    <td>{archivosRechazado.nombreArchivo}</td>
                                    <td>{archivosRechazado.estadoArchivo}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}


export default class ArchivosRechazado extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/archivo/consulta/rechazos/';

    state = {
        archivosRechazados: [],
        message: {
            text: '',
            alert: ''
        }
    }

    componentDidMount() {
        this.Listar(1);
    }

    Listar = (pagina) => {
        const requestInfoGet = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };
		
        fetch(this.UrlLista + pagina, requestInfoGet, { mode: 'cors' })
            .then(response => response.json())
            .then(archivosRechazados => this.setState({ archivosRechazados }))
            //.then(archivosRechazados => console.log(archivosRechazados))
            .catch(e => console.log(e));
    }

    render() {
        return (
            <div className="main">
                <div >
                    <div >
                        <h2 > Lista de Archivos con Rechazos </h2>
                        <ListArchivosRechazados ListarPagina={this.Listar} archivosRechazados={this.state.archivosRechazados} />
                    </div>
                </div>
            </div>
        );
    }
}