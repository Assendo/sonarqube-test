import React, { Component } from 'react';
import PubSub from 'pubsub-js';//npm install --save pubsub-js

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

class FormParametro extends Component {

    state = {
        model: {
            idparametro: 0,
            tipo: '',
            valor: ''
        }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    create = () => {
        this.setState({ model: { idparametro: 0, tipo: '', valor: '' } })
        this.props.parametroCreate(this.state.model);

        console.log("[Parametro.js] idparametro : " + this.state.model.idparametro);
        console.log("[Parametro.js] tipo : " + this.state.model.tipo);
        console.log("[Parametro.js] valor : " + this.state.model.valor);

    }

    componentWillMount() {
        PubSub.subscribe('edit-parametro', (topic, parametro) => {
            this.setState({ model: parametro });
        });
    }

    render() {
        return (
            <Form>

                <FormGroup>
                    <Label for="tipo">Tipo:</Label>
                    <Input id="tipo" type="text" value={this.state.model.tipo} placeholder="Tipo de parametro..."
                        onChange={e => this.setValues(e, 'tipo')} />
                </FormGroup>

                <FormGroup>
                    <Label for="valor">Valor:</Label>
                    <Input id="valor" type="text" value={this.state.model.valor} placeholder="Valor de parametro..."
                        onChange={e => this.setValues(e, 'valor')} />
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

class ListParametros extends Component {
    delete = (tipo) => {
        this.props.deleteParametro(tipo);
    }

    onEdit = (parametro) => {

        this.setState({ parametro: { idparametro: 1 } })

        parametro.idparametro = 1;

        PubSub.publish('edit-parametro', parametro);
        this.props.closePopup();
    }

    render() {
        const { parametros } = this.props;

        return (
            <div>
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Tipo</th>
                            <th>Valor</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.parametros.map((parametro, i) => (

                                <tr key={i}>
                                    <td>{parametro.tipo}</td>
                                    <td>{parametro.valor}</td>
                                    <td>
                                        <Button color="info" size="sm" onClick={e => this.onEdit(parametro)}>Editar</Button>
                                        <Button color="danger" size="sm" onClick={e => this.delete(parametro.tipo)}>Eliminar</Button>
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


export default class Parametro extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/parametro/consulta/lista';
    UrlAgregar = this.props.LocalHost + '/sta/application/parametro/agregar/';
    UrlElimina = this.props.LocalHost + '/sta/application/parametro/eliminar/';
    UrlModificar = this.props.LocalHost + '/sta/application/parametro/modificar/';

    state = {
        parametros: [],
        message: {
            text: '',
            alert: ''
        },
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
            .then(parametros => this.setState({ parametros }))
            //.then(parametros => console.log(parametros))
            .catch(e => console.log(e));
    }

    save = (parametro) => {
        let data = {
            idparametro: parametro.idparametro,
            tipo: parametro.tipo,
            valor: parametro.valor
        };

        //console.log(data);
        const requestInfo = {
            method: data.tipo !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        if (data.idparametro === 0) {
            fetch(`${this.UrlAgregar}${data.tipo}/${data.valor}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(newParametro => {
                    let { parametros } = this.state;
                    parametros.push(data);
                    this.setState({ parametros, message: { text: 'Nueva Parametro ingresado!', alert: 'success' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        } else {
            fetch(`${this.UrlModificar}${data.tipo}/${data.valor}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(updatedParametro => {
                    let { parametros } = this.state;
                    let position = parametros.findIndex(parametro => parametro.tipo === data.tipo && parametro.valor === data.valor);

                    parametros[position] = data;
                    this.setState({ parametros, message: { text: 'parametro modificada correctamente!', alert: 'info' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        }
    }

    //elimina parametro

    delete = (tipo) => {

        let data = {
            codigo: Number(tipo)
        };

        const requestInfo = {
            method: data.tipo !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        fetch(`${this.UrlElimina}${tipo}`, requestInfo, { mode: 'cors' })
            .then(response => response.json())
            .then(rows => {
                const parametros = this.state.parametros.filter(parametro => parametro.tipo !== tipo);
                this.setState({ parametros, message: { text: 'Parametro eliminada correctamente.', alert: 'danger' } });
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
                    <div className="col-md-12 my-3">
                        <h2 className="font-weight-bold text-center"> Lista de Parametros </h2>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-8 my-3">

                    </div>
                    <div className="col-md-4 my-3" align="right">
                        <Button onClick={this.togglePopup.bind(this)} color="primary" >Crear Parametro</Button>
                    </div>

                </div>

                
                <br />
                <div className="col-md-12 my-3">
                    <ListParametros parametros={this.state.parametros} deleteParametro={this.delete} closePopup={this.togglePopup.bind(this)} />
                </div>

                {
                    this.state.showPopup ?
                        <div className='popup'>
                            <div className='popup_inner'>
                                <h2 className="font-weight-bold text-center"> Edición de Parametro </h2>
                                <FormParametro parametroCreate={this.save} closePopup={this.togglePopup.bind(this)} />


                            </div>

                        </div>
                        : null
                }
            </div >
        );
    }


}

