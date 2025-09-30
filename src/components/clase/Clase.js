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

class FormClase extends Component {

    state = {
        model: {
            idclase: 0,
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
        this.setState({ model: { idclase: 0, codigo: 0, descripcion: '' } })
        this.props.claseCreate(this.state.model);

        console.log("[Clase.js] idclase : " + this.state.model.idclase);
        console.log("[Clase.js] codigo : " + this.state.model.codigo);
        console.log("[Clase.js] descripcion : " + this.state.model.descripcion);

    }

    componentWillMount() {
        PubSub.subscribe('edit-clase', (topic, clase) => {
            this.setState({ model: clase });
        });
    }

    render() {
        return (
            <Form>
                <div >
                    <FormGroup>
                        <Label for="descripcion">Descripción:</Label>
                        <Input id="descripcion" type="text" value={this.state.model.descripcion} placeholder="Descripción de clase..."
                            onChange={e => this.setValues(e, 'descripcion')} />
                    </FormGroup>
                </div>

                <div >
                    <FormGroup>
                        <Label for="codigo">Código:</Label>
                        <Input id="codigo" type="text" value={this.state.model.codigo} placeholder="codigo de clase..."
                            onChange={e => this.setValues(e, 'codigo')} />
                    </FormGroup>
                </div>




                <div className="row">
                        <div className="col-md-9 my-3">
                            <Button color="primary" block onClick={this.create}> Grabar </Button>
                        </div>
                        <div className="col-md-3 my-3">
                            <Button TYPE="reset" block color="danger" onClick={this.props.closePopup}>Cancelar</Button>
                        </div>
                    </div>
            </Form>
        );
    }
}

/* Radio: {this.state.model.Activo}<br/> */

class ListClases extends Component {
    delete = (codigo) => {
        this.props.deleteClase(codigo);
    }

    onEdit = (clase) => {

        this.setState({ clase: { idclase: 1 } })
        clase.idclase = 1;

        PubSub.publish('edit-clase', clase);
        this.props.closePopup();
    }

    render() {
        const { clases } = this.props;
        console.log(clases)

        return (
            <div>
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Descripción</th>
                            <th>Código</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.clases.map((clase, i) => (

                                <tr key={i}>
                                    <td>{clase.descripcion}</td>
                                    <td>{clase.codigo}</td>
                                    <td>
                                        <Button color="info" size="sm" onClick={e => this.onEdit(clase)}>Editar</Button>
                                        <Button color="danger" size="sm" onClick={e => this.delete(clase.codigo)}>Eliminar</Button>
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


export default class Clase extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/clase/consulta/lista';
    UrlAgregar = this.props.LocalHost + '/sta/application/clase/agregar/';
    UrlElimina = this.props.LocalHost + '/sta/application/clase/eliminar/';
    UrlModificar = this.props.LocalHost + '/sta/application/clase/modificar/';

    state = {
        clases: [],
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
            .then(clases => this.setState({ clases }))
            //.then(clases => console.log(clases))
            .catch(e => console.log(e));
    }

    save = (clase) => {
        let data = {
            idclase: clase.idclase,
            codigo: clase.codigo,
            descripcion: clase.descripcion
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

        if (data.idclase === 0) {
            fetch(`${this.UrlAgregar}${data.codigo}/${data.descripcion}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(newClase => {
                    let { clases } = this.state;
                    clases.push(data);
                    this.setState({ clases, message: { text: 'Nueva Clase ingresado!', alert: 'success' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        } else {
            fetch(`${this.UrlModificar}${data.codigo}/${data.descripcion}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(updatedClase => {
                    let { clases } = this.state;
                    let position = clases.findIndex(clase => clase.codigo === data.codigo);
                    console.log("position : " + position);

                    clases[position] = data;
                    this.setState({ clases, message: { text: 'clase modificada correctamente!', alert: 'info' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        }
    }

    //elimina clase

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
                const clases = this.state.clases.filter(clase => clase.codigo !== codigo);
                this.setState({ clases, message: { text: 'Clase eliminada correctamente.', alert: 'danger' } });
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
                        <h2 className="font-weight-bold text-center"> Lista de Clases </h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 my-3">

                    </div>
                    <div className="col-md-4 my-3" align="right">
                        <Button onClick={this.togglePopup.bind(this)} color="primary" >Crear Clase</Button>
                    </div>

                </div>
                <div className="row">

                    <div className="col-md-12 my-3">
                        <ListClases clases={this.state.clases} deleteClase={this.delete} closePopup={this.togglePopup.bind(this)}/>
                    </div>
                </div>



                {this.state.showPopup ?
                    <div className='popup'>
                        <div className='popup_inner'>
                            <h2 className="font-weight-bold text-center"> Edición de Clase </h2>
                            <FormClase claseCreate={this.save} closePopup={this.togglePopup.bind(this)} />


                        </div>

                    </div>
                    : null
                }
            </div>
        );
    }


}

