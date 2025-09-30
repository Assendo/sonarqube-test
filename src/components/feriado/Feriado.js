import React, { Component } from 'react';
import PubSub from 'pubsub-js';//npm install --save pubsub-js
import Dropdown from './Dropdown';

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

class FormFeriado extends Component {

    state = {
        model: {
            idferiado: 0,
            fecha: '',
            tipo: '',
            fecha2: ''
        }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    create = () => {
        this.setState({ model: { idferiado: 0, fecha: '2019-09-01', tipo: '', fecha2: '' } })
        this.props.feriadoCreate(this.state.model);
        console.log("[Feriado.js] idferiado : " + this.state.model.idferiado);
        console.log("[Feriado.js] fecha : " + this.state.model.fecha);
        console.log("[Feriado.js] tipo : " + this.state.model.tipo);
    }

    componentWillMount() {

        PubSub.subscribe('edit-feriado', (topic, feriado) => {
            console.log("[Feriado.js] feriado : " + feriado.fecha);
            this.setState({
                model: {
                    ...this.state.model,
                    idferiado: 1,
                    fecha: feriado.fecha,
                    tipo: feriado.tipo,
                    fecha2: feriado.fecha,
                }
            });

            //this.setState({ model: feriado });
        });

    }

    ElijeEnDropdown = (nombre, codigo, descripcion) => {

        this.setState({ model: { ...this.state.model, tipo: descripcion } });

    }


    render() {
        return (
            <Form>
                <FormGroup>
                    <Label for="fecha1">Fecha de Feriado : &nbsp;&nbsp;&nbsp;</Label>
                    <Input id="fecha1" type="date" value={this.state.model.fecha} placeholder="fecha..."
                        onChange={e => this.setValues(e, 'fecha')} />
                </FormGroup>

                <FormGroup>
                    <Label for="tipo">Tipo de Feriado:</Label>
                    <div className="form-inline">
                        <Input id="tipo" type="text" value={this.state.model.tipo} placeholder="Tipo..." />
                        <div style={{ display: 'flex', justifyContent: 'center' }} >
                            <Dropdown nombre="tipos" perfiles={this.props.feriadotipo} ElijeEnDropdown={this.ElijeEnDropdown} />
                        </div>
                    </div>
                </FormGroup>

                <div className="row">
                        <div className="col-md-9 my-3">
                            <Button color="primary" block onClick={this.create}> Grabar </Button>
                        </div>
                        <div className="col-md-3 my-3">
                            <Button TYPE="reset" color="danger" onClick={this.props.closePopup}>Cancelar</Button>
                        </div>
                    </div>

            </Form>
        );
    }
}

/* Radio: {this.state.model.Activo}<br/> */

class ListFeriados extends Component {
    delete = (fecha) => {
        this.props.deleteFeriado(fecha);
    }

    onEdit = (feriado) => {

        this.setState({ feriado: { idferiado: 1 } })

        feriado.idferiado = 1;

        PubSub.publish('edit-feriado', feriado);
        this.props.closePopup();
    }

    render() {
        const { feriados } = this.props;

        return (
            <div>
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.feriados.map((feriado, i) => (

                                <tr key={i}>
                                    <td>{feriado.fecha}</td>
                                    <td>{feriado.tipo}</td>
                                    <td>
                                        <Button color="info" size="sm" onClick={e => this.onEdit(feriado)}>Editar</Button>
                                        <Button color="danger" size="sm" onClick={e => this.delete(feriado.fecha)}>Eliminar</Button>
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


export default class Feriado extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/feriado/consulta/lista';
    UrlAgregar = this.props.LocalHost + '/sta/application/feriado/agregar/';
    UrlElimina = this.props.LocalHost + '/sta/application/feriado/eliminar/';
    UrlModificar = this.props.LocalHost + '/sta/application/feriado/modificar/';

    state = {
        feriados: [],
        message: {
            text: '',
            alert: ''
        },
        feriadotipo: [{ codigo: '1', descripcion: 'PERM' }, { codigo: '2', descripcion: 'ANUAL' }],
        showPopup: false
    }

    togglePopup() {
        this.setState(
            {
                showPopup: !this.state.showPopup
            }
        );
    }

    componentDidMount() {
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
            .then(feriados => this.setState({ feriados }))
            //.then(feriados => console.log(feriados))
            .catch(e => console.log(e));

        this.state.feriadotipo.push();

    }

    save = (feriado) => {
        let data = {
            idferiado: feriado.idferiado,
            fecha: feriado.fecha,
            tipo: feriado.tipo,
            fecha2: feriado.fecha2,
        };

        //console.log(data);
        const requestInfo = {
            method: 'PUT', //method: data.idferiado !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        var fechaNum = data.fecha.replace("-", "").replace("-", "");
        var fechaNum2 = data.fecha2.replace("-", "").replace("-", "");

        if (data.idferiado === 0) {

            fetch(`${this.UrlAgregar}${fechaNum}/${data.tipo}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(newFeriado => {
                    let { feriados } = this.state;
                    feriados.push(data);
                    this.setState({ feriados, message: { text: 'Nuevo Feriado ingresado!', alert: 'success' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        } else {
            fetch(`${this.UrlModificar}${fechaNum2}/${fechaNum}/${data.tipo}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(updatedFeriado => {
                    let { feriados } = this.state;
                    let position = feriados.findIndex(feriado => feriado.fecha === data.fecha2);

                    feriados[position] = data;
                    this.setState({ feriados, message: { text: 'feriado modificado correctamente!', alert: 'info' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        }
    }

    //elimina feriado

    delete = (fecha) => {

        var fechabd = fecha.replace("-", "").replace("-", "");

        let data = {
            fecha: fecha
        };

        const requestInfo = {
            method: fechabd !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        fetch(`${this.UrlElimina}${fechabd}`, requestInfo, { mode: 'cors' })
            .then(response => response.json())
            .then(rows => {
                const feriados = this.state.feriados.filter(feriado => feriado.fecha !== data.fecha);
                this.setState({ feriados, message: { text: 'Feriado eliminado correctamente.', alert: 'danger' } });
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

        //console.log("xxxxxxxxxxxxxxxxxxxxxxx " + this.someProp); 

        return (
            <div className="main">
                {
                    this.state.message.text !== '' ? (
                        <Alert color={this.state.message.alert} className="text-center"> {this.state.message.text} </Alert>
                    ) : ''
                }

                <div className="row">

                    <div className="col-md-12 my-3">
                        <h2 className="font-weight-bold text-center"> Lista de Feriados </h2>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-8 my-3">

                    </div>
                    <div className="col-md-4 my-3" align="right">
                        <Button onClick={this.togglePopup.bind(this)} color="primary" >Crear Feriado</Button>
                    </div>

                </div>

                <div className="row">


                    <div className="col-md-12 my-3">
                        <ListFeriados feriados={this.state.feriados} deleteFeriado={this.delete} closePopup={this.togglePopup.bind(this)} />
                    </div>
                </div>
                {this.state.showPopup ?
                    <div className='popup'>
                        <div className='popup_inner'>
                            <h2 className="font-weight-bold text-center"> Edición de Feriado </h2>
                            <FormFeriado feriadoCreate={this.save} feriadotipo={this.state.feriadotipo} closePopup={this.togglePopup.bind(this)} />


                        </div>

                    </div>
                    : null
                }
            </div>
        );
    }


}

