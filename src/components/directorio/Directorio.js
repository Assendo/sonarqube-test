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


/* Radio: {this.state.model.Activo}<br/> */


class FormDirectorio extends Component {

    state = {
        model: {
            iddirectorio: 0,
            codigo: 0,
            nombre: '',
            direccion: ''
        }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    create = () => {
        this.setState({ model: { iddirectorio: 0, codigo: 0, nombre: '', direccion: '' } })
        this.props.directorioCreate(this.state.model);

        console.log("[Directorio.js] iddirectorio: " + this.state.model.iddirectorio);
        console.log("[Directorio.js] codigo: " + this.state.model.codigo);
        console.log("[Directorio.js] nombre: " + this.state.model.nombre);
        console.log("[Directorio.js] direccion: " + this.state.model.direccion);

    }

    componentWillMount() {
        PubSub.subscribe('edit-directorio', (topic, directorio) => {
            this.setState({ model: directorio });
        });
    }

    render() {
        return (
            <Form>
                <FormGroup>
                    <Label for="nombre">Nombre:</Label>
                    <Input id="nombre" type="text" value={this.state.model.nombre} placeholder="Nombre..."
                        onChange={e => this.setValues(e, 'nombre')} />
                </FormGroup>
                <FormGroup>
                    <Label for="direccion">Dirección:</Label>
                    <Input id="direccion" type="text" value={this.state.model.direccion} placeholder="Dirección..."
                        onChange={e => this.setValues(e, 'direccion')} />
                </FormGroup>
                <br />
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


class ListDirectorios extends Component {
    delete = (codigo) => {
        this.props.deleteDirectorio(codigo);
    }

    onEdit = (directorio) => {

        this.setState({ directorio: { iddirectorio: 1 } })

        directorio.iddirectorio = 1;

        PubSub.publish('edit-directorio', directorio);
        this.props.closePopup();
    }

    render() {
        const { directorios } = this.props;
        console.log(directorios)

        return (
            <div>
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Direccion</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.directorios.map((directorio, i) => (

                                <tr key={i}>
                                    <td>{directorio.codigo}</td>
                                    <td>{directorio.nombre}</td>
                                    <td>{directorio.direccion}</td>
                                    <td>
                                        <Button color="info" size="sm" onClick={e => this.onEdit(directorio)}>Editar</Button>
                                        <Button color="danger" size="sm" onClick={e => this.delete(directorio.codigo)}>Eliminar</Button>
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


export default class Directorio extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/directorio/consulta/lista';
    //nombre,codigo,direccion
    UrlElimina = this.props.LocalHost + '/sta/application/directorio/eliminar/';

    UrlAgregar = this.props.LocalHost + '/sta/application/directorio/agregar/';
    UrlModificar = this.props.LocalHost + '/sta/application/directorio/modificar/';

    state = {
        directorios: [],
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
        this.Listar();
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
            .then(directorios => this.setState({ directorios }))
            //.then(directorios => console.log(directorios))
            .catch(e => console.log(e));

        console.log("[Directorio.js] Busqueda de lista de directorios");
    }

    save = (directorio) => {
        let data = {
            iddirectorio: directorio.iddirectorio,
            nombre: directorio.nombre,
            codigo: directorio.codigo,
            direccion: directorio.direccion
        };

        let data2 = {
            codigo: directorio.codigo,
            direccion: directorio.direccion,
            nombre: directorio.nombre
        };

        //console.log(data);
        const requestInfo = {
            method: 'PUT',
            //method: data.iddirectorio !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data2),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        if (data.iddirectorio === 0) {
            console.log("requestInfo: " + requestInfo);
            fetch(`${this.UrlAgregar}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(newDirectorio => {
                    let { directorios } = this.state;
                    //directorios.push(data);
                    this.Listar();
                    this.setState({ directorios, message: { text: 'Nueva Directorio ingresado!', alert: 'success' } });
                    this.timerMessage(3000);

                })
                .catch(e => console.log(e));

        } else {
            console.log("requestInfo: " + requestInfo);
            fetch(`${this.UrlModificar}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(updatedDirectorio => {
                    let { directorios } = this.state;
                    let position = directorios.findIndex(directorio => directorio.codigo === data.codigo);
                    console.log("position : " + position);

                    directorios[position] = data;
                    this.setState({ directorios, message: { text: 'directorio modificada correctamente!', alert: 'info' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        }
    }

    //elimina directorio

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
                const directorios = this.state.directorios.filter(directorio => directorio.codigo !== codigo);
                this.setState({ directorios, message: { text: 'Directorio eliminada correctamente.', alert: 'danger' } });
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
                        <h2 className="font-weight-bold text-center"> Lista de Directorios </h2>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-8 my-3">

                    </div>
                    <div className="col-md-4 my-3" align="right">
                        <Button onClick={this.togglePopup.bind(this)} color="primary" >Crear Directorio</Button>
                    </div>

                </div>

                <br />
                <div className="col-md-12 my-3">
                    
                    <ListDirectorios directorios={this.state.directorios} deleteDirectorio={this.delete} closePopup={this.togglePopup.bind(this)} />
                </div>
                {this.state.showPopup ?
                    <div className='popup'>
                        <div className='popup_inner'>
                            <h2 className="font-weight-bold text-center"> Edición de Directorio </h2>
                            <FormDirectorio directorioCreate={this.save} closePopup={this.togglePopup.bind(this)} />


                        </div>

                    </div>
                    : null
                }
            </div>
        );
    }
}