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

//nombre,Activo,codigoSbif

/* Radio: {this.state.model.Activo}<br/> */

class ListArchivos extends Component {

    state = {
        model: {
            fecha: "2019-09-01",
        }
    };

    hoyFecha = () => {
        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;
        var yyyy = hoy.getFullYear();

        dd = this.addZero(dd);
        mm = this.addZero(mm);

        return yyyy + '-' + mm + '-' + dd;
    }

    addZero = (i) => {
        if (i < 10) {
            i = '0' + i;
        }
        return i;
    }


    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    componentDidMount() {
        console.log("[Archivo.js] fecha actual: " + this.hoyFecha());

        this.setState({ model: { ...this.state.model, fecha: this.hoyFecha() } });
    }

    listar = () => {
        console.log("[Archivo.js] Fecha de busqueda x1: " + this.state.model.fecha);
        let fx = this.state.model.fecha.replace("-", "").replace("-", "");
        this.props.ListarPagina(fx);
    }

    onEdit = (archivo) => {
        this.props.Reprocesa(archivo);
    }

    render() {
        const { archivos } = this.props;
        console.log(archivos)

        return (
            <div>

                <div align="center" className="row">
                    <div className="col-md-6 my-6">
                        <div className="form-inline">
                            <FormGroup>
                                <Label for="fecha1">Fecha de Busqueda : &nbsp;&nbsp;&nbsp;</Label>
                                <Input id="fecha1" type="date" value={this.state.model.fecha} placeholder="fecha..."
                                    onChange={e => this.setValues(e, 'fecha')} />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="col-md-6 my-6">
                        <Button color="primary" block onClick={this.listar}> Buscar </Button>
                    </div>
                </div>

                <br/>

                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Archivo</th>
                            <th>Estado</th>
                            <th>Fecha Hora</th>
                            <th>Accion</th>
                            <th>Reprocesar</th>
                            <th>Usuario</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.archivos.map((archivo, i) => (

                                <tr key={i}>
                                    <td>{archivo.nombreArchivo}</td>
                                    <td>{archivo.estadoArchivo}</td>
                                    <td>{archivo.fechaHora}</td>
                                    <td>{archivo.accion}</td>
                                    <td>{archivo.reprocesar}</td>
                                    <td>{archivo.codigoUsuario}</td>
                                    <td>
                                        <Button color="info" size="sm" onClick={e => this.onEdit(archivo)}>Reprocesa</Button>
                                    </td>
                                </tr>
                            ))


                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}


export default class Archivo extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/archivo/consulta/lista/';//{fecha}
    UrlReprocesa = this.props.LocalHost + '/sta/application/archivo/reprocesar/';//{nombreArchivo}

    state = {
        archivos: [],
        message: {
            text: '',
            alert: ''
        }
    }

    componentDidMount() {
        this.Listar("20190910"); //06,10,16
    }

    //añomesdia
    Listar = (fecha1) => {
        console.log("++++++++++++++++++++BUSCANDO LISTA POR FECHA+++++++++++++++++++ :" + fecha1);
		const requestInfoGet = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };
		
        fetch(this.UrlLista + fecha1, requestInfoGet, { mode: 'cors' })
            .then(response => response.json())
            .then(archivos => this.setState({ archivos }))
            //.then(archivos => console.log(archivos))
            .catch(e => console.log(e));
    }

    //reprocesa

    Reprocesa = (archivo) => {
        let data = {
            nombreArchivo: archivo.nombreArchivo,
            estadoArchivo: archivo.estadoArchivo,
            codigoAccion: archivo.codigoAccion,
            fechaHora: archivo.fechaHora,
            vecesReprocesado: archivo.vecesReprocesado,
            codigoEstadoArchivo: archivo.codigoEstadoArchivo,
            accion: archivo.accion,
            reprocesar: "1",
            codigoUsuario: archivo.codigoUsuario,
        };

        const requestInfo = {
            method: data.nombreArchivo !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };
        // /archivo/reprocesar/{nombreArchivo}
        fetch(`${this.UrlReprocesa}${data.nombreArchivo}`, requestInfo, { mode: 'cors' })
            .then(response => response.json())
            .then(updatedArchivo => {
                let { archivos } = this.state;
                let position = archivos.findIndex(archivo => archivo.nombreArchivo === data.nombreArchivo);
                console.log("position : " + position);

                archivos[position] = data;
                this.setState({ archivos, message: { text: 'Archivo procesado correctamente!', alert: 'info' } });
                this.timerMessage(3000);
            })
            .catch(e => console.log(e));
    }


    timerMessage = (duration) => {
        setTimeout(() => {
            this.setState({ message: { text: '', alert: '' } });
        }, duration);
    }

    render() {
        return (
            <div className="main">
                {
                    this.state.message.text !== '' ? (
                        <Alert color={this.state.message.alert} className="text-center"> {this.state.message.text} </Alert>
                    ) : ''
                }

                <div className="row">
                    <div className="col-md-12 my-6">
                        <h2 className="font-weight-bold text-center"> Lista de Archivos </h2>
                        <ListArchivos archivos={this.state.archivos} ListarPagina={this.Listar} Reprocesa={this.Reprocesa} />
                    </div>
                </div>
            </div>
        );
    }


}

