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

class FormGlosa extends Component {

    state = {
        model: {
            idglosa: 0,
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
        this.setState({ model: { idglosa: 0, codigo: 0, descripcion: '' } })
        this.props.glosaCreate(this.state.model);

        console.log("[Glosa.js] idglosa : " + this.state.model.idglosa);
        console.log("[Glosa.js] codigo : " + this.state.model.codigo);
        console.log("[Glosa.js] descripcion : " + this.state.model.descripcion);

    }

    componentWillMount() {
        PubSub.subscribe('edit-glosa', (topic, glosa) => {
            this.setState({ model: glosa });
        });
    }

    render() {
        return (
            <Form>

                <FormGroup>
                    <Label for="descripcion">Descripción:</Label>
                    <Input id="descripcion" type="text" value={this.state.model.descripcion} placeholder="Descripción de glosa..."
                        onChange={e => this.setValues(e, 'descripcion')} />
                </FormGroup>

                <FormGroup>
                    <Label for="codigo">Código:</Label>
                    <Input id="codigo" type="text" value={this.state.model.codigo} placeholder="codigo de glosa..."
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

/* Radio: {this.state.model.Activo}<br/> */

class ListGlosas extends Component {
    delete = (codigo) => {
        this.props.deleteGlosa(codigo);
    }

    onEdit = (glosa) => {

        this.setState({ glosa: { idglosa: 1 } })

        glosa.idglosa = 1;

        PubSub.publish('edit-glosa', glosa);
        this.props.closePopup();
    }

    render() {
        const { glosas } = this.props;

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
                            this.props.glosas.map((glosa, i) => (

                                <tr key={i}>
                                    <td>{glosa.descripcion}</td>
                                    <td>{glosa.codigo}</td>
                                    <td>
                                        <Button color="info" size="sm" onClick={e => this.onEdit(glosa)}>Editar</Button>
                                        <Button color="danger" size="sm" onClick={e => this.delete(glosa.codigo)}>Eliminar</Button>
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


export default class Glosa extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/descripcionglosa/consulta/lista';
    UrlAgregar = this.props.LocalHost + '/sta/application/descripcionglosa/agregar/';
    UrlElimina = this.props.LocalHost + '/sta/application/descripcionglosa/eliminar/';
    UrlModificar = this.props.LocalHost + '/sta/application/descripcionglosa/modificar/';

    state = {
        glosas: [],
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
            .then(glosas => this.setState({ glosas }))
            //.then(glosas => console.log(glosas))
            .catch(e => console.log(e));
    }

    save = (glosa) => {
        let data = {
            idglosa: glosa.idglosa,
            codigo: glosa.codigo,
            descripcion: glosa.descripcion
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

        if (data.idglosa === 0) {
            fetch(`${this.UrlAgregar}${data.codigo}/${data.descripcion}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(newGlosa => {
                    let { glosas } = this.state;
                    glosas.push(data);
                    this.setState({ glosas, message: { text: 'Nueva Glosa ingresado!', alert: 'success' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        } else {
            fetch(`${this.UrlModificar}${data.codigo}/${data.descripcion}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(updatedGlosa => {
                    let { glosas } = this.state;
                    let position = glosas.findIndex(glosa => glosa.codigo === data.codigo);

                    glosas[position] = data;
                    this.setState({ glosas, message: { text: 'glosa modificada correctamente!', alert: 'info' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        }
    }

    //elimina glosa

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
                const glosas = this.state.glosas.filter(glosa => glosa.codigo !== codigo);
                this.setState({ glosas, message: { text: 'Glosa eliminada correctamente.', alert: 'danger' } });
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
                        <h2 className="font-weight-bold text-center"> Lista de Glosas </h2>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-8 my-3">

                    </div>
                    <div className="col-md-4 my-3" align="right">
                        <Button onClick={this.togglePopup.bind(this)} color="primary" >Crear Glosa</Button>
                    </div>

                </div>

                <div className="row">

                    <div className="col-md-12 my-3">
                        <ListGlosas glosas={this.state.glosas} deleteGlosa={this.delete} closePopup={this.togglePopup.bind(this)} />
                    </div>
                </div>
                {this.state.showPopup ?
                    <div className='popup'>
                        <div className='popup_inner'>
                            <h2 className="font-weight-bold text-center"> Edición de Glosa </h2>
                            <FormGlosa glosaCreate={this.save} closePopup={this.togglePopup.bind(this)} />


                        </div>

                    </div>
                    : null
                }
            </div>
        );
    }


}

