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


class FormTipostransaccion extends Component {

    state = {
        model: {
            idtipotransaccion: 0,
            codigo: 0,
            descripcion: ''
        }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    create = () => {
        this.setState({ model: { idtipotransaccion: 0, codigo: 0, descripcion: '' } })
        this.props.tipostransaccionCreate(this.state.model);

        console.log("[Tipotransaccion.js] idtipostransaccion : " + this.state.model.idtipotransaccion);
        console.log("[Tipotransaccion.js] codigo : " + this.state.model.codigo);
        console.log("[Tipotransaccion.js] descripcion : " + this.state.model.descripcion);

    }

    componentWillMount() {
        PubSub.subscribe('edit-tipostransaccion', (topic, tipostransaccion) => {
            this.setState({ model: tipostransaccion });
        });
    }

    render() {
        return (
            <Form>

                <FormGroup>
                    <Label for="descripcion">Descripción:</Label>
                    <Input id="descripcion" type="text" value={this.state.model.descripcion} placeholder="Descripción de tipos de transaccion..."
                        onChange={e => this.setValues(e, 'descripcion')} />
                </FormGroup>

                <FormGroup>
                    <Label for="codigo">Código:</Label>
                    <Input id="codigo" type="text" value={this.state.model.codigo} placeholder="codigo de tipo de transaccion..."
                        onChange={e => this.setValues(e, 'codigo')} />
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

class ListTipostransaccions extends Component {
    delete = (codigo) => {
        this.props.deleTetipotransaccion(codigo); //deleTetipotransaccion
    }

    onEdit = (tipostransaccion) => {

        this.setState({ tipostransaccion: { idtipotransaccion: 1 } })

        tipostransaccion.idtipotransaccion = 1;

        PubSub.publish('edit-tipostransaccion', tipostransaccion);
        this.props.closePopup();

    }

    render() {
        const { tipostransaccions } = this.props;

        return (
            <div>
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Descipción</th>
                            <th>Código</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.tipostransaccions.map((tipostransaccion, i) => (

                                <tr key={i}>
                                    <td>{tipostransaccion.descripcion}</td>
                                    <td>{tipostransaccion.codigo}</td>
                                    <td>
                                        <Button color="info" size="sm" onClick={e => this.onEdit(tipostransaccion)}>Editar</Button>
                                        <Button color="danger" size="sm" onClick={e => this.delete(tipostransaccion.codigo)}>Eliminar</Button>
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


export default class Tipotransaccion extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/tipotransaccion/consulta/lista';
    UrlAgregar = this.props.LocalHost + '/sta/application/tipotransaccion/agregar/';
    UrlElimina = this.props.LocalHost + '/sta/application/tipotransaccion/eliminar/';
    UrlModificar = this.props.LocalHost + '/sta/application/tipotransaccion/modificar/';

    state = {
        tipotransaccions: [],
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
            .then(tipotransaccions => this.setState({ tipotransaccions }))
            //.then(tipotransaccions => console.log(tipotransaccions))
            .catch(e => console.log(e));
    }

    save = (tipotransaccion) => {
        let data = {
            idtipotransaccion: tipotransaccion.idtipotransaccion,
            codigo: tipotransaccion.codigo,
            descripcion: tipotransaccion.descripcion
        };

        //console.log(data);
        const requestInfo = {
            method: data.codigo !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        if (data.idtipotransaccion === 0) {
            fetch(`${this.UrlAgregar}${data.codigo}/${data.descripcion}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(newTipotransaccion => {
                    let { tipotransaccions } = this.state;
                    tipotransaccions.push(data);
                    this.setState({ tipotransaccions, message: { text: 'Nuevo tipo de transaccion ingresada!', alert: 'success' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        } else {
            fetch(`${this.UrlModificar}${data.codigo}/${data.descripcion}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(updatedTipotransaccion => {
                    let { tipotransaccions } = this.state;
                    let position = tipotransaccions.findIndex(tipotransaccion => tipotransaccion.codigo === data.codigo);

                    tipotransaccions[position] = data;
                    this.setState({ tipotransaccions, message: { text: 'tipo de transaccion modificada correctamente!', alert: 'info' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        }
    }

    //elimina tipotransaccion

    delete = (codigo) => {

        let data = {
            codigo: Number(codigo)
        };

        const requestInfo = {
            method: data.codigo !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        fetch(`${this.UrlElimina}${codigo}`, requestInfo, { mode: 'cors' })
            .then(response => response.json())
            .then(rows => {
                const tipotransaccions = this.state.tipotransaccions.filter(tipotransaccion => tipotransaccion.codigo !== codigo);
                this.setState({ tipotransaccions, message: { text: 'Tipo de transaccion eliminada correctamente.', alert: 'danger' } });
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
                        <h2 className="font-weight-bold text-center"> Lista de Tipos Transacción </h2>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-8 my-3">

                    </div>
                    <div className="col-md-4 my-3" align="right">
                        <Button onClick={this.togglePopup.bind(this)} color="primary" >Crear Tipos Transacción</Button>
                    </div>

                </div>

                <br/>
                <div className="col-md-12 my-3">
                    <ListTipostransaccions tipostransaccions={this.state.tipotransaccions} deleTetipotransaccion={this.delete} closePopup={this.togglePopup.bind(this)} />
                </div>

                {this.state.showPopup ?
                    <div className='popup'>
                        <div className='popup_inner'>
                            <h2 className="font-weight-bold text-center"> Edición de Tipos Transacción </h2>
                            <FormTipostransaccion tipostransaccionCreate={this.save} closePopup={this.togglePopup.bind(this)} />


                        </div>

                    </div>
                    : null
                }

            </div>
        );
    }


}

