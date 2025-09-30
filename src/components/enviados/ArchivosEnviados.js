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

class ListArchivosEnviados extends Component {
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
        const { archivosEnviados } = this.props;

        //const elements = ['1', '2', '3'];
        //elements.push('9');
        const elements = [];

        this.props.archivosEnviados.slice(0, 1).map((archivosEnviado, i) => (
            //console.log("Pagina de render : " + archivosEnviado.cantPags)
            this.onTotPag(archivosEnviado.cantPags)
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
                            this.props.archivosEnviados.map((archivosEnviado, i) => (
                                <tr key={i}>
                                    <td>{archivosEnviado.fechaHora}</td>
                                    <td>{archivosEnviado.codigoUsuario}</td>
                                    <td>{archivosEnviado.accion}</td>
                                    <td>{archivosEnviado.nombreArchivo}</td>
                                    <td>{archivosEnviado.estadoArchivo}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}


export default class ArchivosEnviado extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/archivo/consulta/enviados/';

    state = {
        archivosEnviados: [],
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
            .then(archivosEnviados => this.setState({ archivosEnviados }))
            //.then(archivosEnviados => console.log(archivosEnviados))
            .catch(e => console.log(e));
    }

    render() {
        return (
            <div className="main">
                <div >
                    <div >
                        <h2 > Lista de Archivos Enviados </h2>
                        <ListArchivosEnviados ListarPagina={this.Listar} archivosEnviados={this.state.archivosEnviados} />
                    </div>
                </div>
            </div>
        );
    }
}