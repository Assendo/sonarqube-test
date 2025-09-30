import React, { Component } from 'react';
//import './Banco.css';
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
//radio y check https://www.youtube.com/watch?v=BymlDbW8GYM&t=761s

class PopupBanco extends Component {
    render() {
        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <h1>{this.props.text}</h1>
                    <button onClick={this.props.closePopup}>close</button>

                </div>
            </div>
        );
    }
}


class FormBanco extends Component {

    state = {
        model: {
            idbanco: 0,
            codigoSbif: 0,
            nombre: '',
            Activo: '0'
        }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    create = () => {
        this.setState({ model: { idbanco: 0, codigoSbif: 0, nombre: '', Activo: 0 } })
        this.props.bancoCreate(this.state.model);

        console.log("[Banco.js] idbanco : " + this.state.model.idbanco);
        console.log("[Banco.js] nombre : " + this.state.model.nombre);
        console.log("[Banco.js] Activo : " + this.state.model.Activo);
        console.log("[Banco.js] codigoSbif : " + this.state.model.codigoSbif);

    }

    componentWillMount() {
        PubSub.subscribe('edit-banco', (topic, banco) => {
            this.setState({ model: banco });

        });
    }

    onRadioChange = (e) => {
        if (e.target.value === "1") {
            this.setState({ model: { ...this.state.model, Activo: 1 } });
        } else {
            this.setState({ model: { ...this.state.model, Activo: 0 } });
        }
    }




    render() {
        return (
            <Form>
                <FormGroup>
                    <Label for="nombre">Nombre:</Label>
                    <Input id="nombre" type="text" value={this.state.model.nombre} placeholder="Nombre de banco..."
                        onChange={e => this.setValues(e, 'nombre')} />
                </FormGroup>
                <FormGroup>
                    <Label for="codigoSbif">Codigo SBIF:</Label>
                    <Input id="codigoSbif" type="text" value={this.state.model.codigoSbif} placeholder="codigoSbif de banco..."
                        onChange={e => this.setValues(e, 'codigoSbif')} />
                </FormGroup>

                <FormGroup>
                    <div align="center" className="radio">
                        <Input type="radio"
                            name="radio1"
                            value="1"
                            checked={this.state.model.Activo === 1}
                            onChange={this.onRadioChange} />Activo<br />

                    </div>
                    <div align="center" className="radio">
                        <Input type="radio"
                            name="radio1"
                            value="0"
                            checked={this.state.model.Activo === 0}
                            onChange={this.onRadioChange} />No Activo<br />
                    </div>
                </FormGroup>

                <FormGroup>
                    <div className="row">
                        <div className="col-md-9 my-3">
                            <Button color="primary" block onClick={this.create}> Grabar </Button>
                        </div>
                        <div className="col-md-3 my-3">
                            <Button TYPE="reset" color="danger" onClick={this.props.closePopup}>Cancelar</Button>
                        </div>
                    </div>
                </FormGroup>
            </Form>
        );
    }
}

/* Radio: {this.state.model.Activo}<br/> */

class ListBancos extends Component {
    delete = (codigoSbif) => {
        this.props.deleteBanco(codigoSbif);
    }

    onEdit = (banco) => {

        this.setState({ banco: { idbanco: 1 } })

        banco.idbanco = 1;
        console.log("onEdit:" + banco.idbanco);



        PubSub.publish('edit-banco', banco);
        this.props.closePopup();
    }


    render() {
        const { bancos } = this.props;
        console.log(bancos)

        return (
            <div>
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Nombre</th>
							<th>Código SBIF</th>
                            <th>Activo</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            /*                        bancos.map(banco => (
                                                        <tr key={banco.codigoSbif}>
                                                            <td>{banco.nombre}</td>
                                                            <td>{banco.Activo}</td>
                                                            <td>
                                                                <Button color="info" size="sm" onClick={e => this.onEdit(banco)}>Editar</Button>
                                                                <Button color="danger" size="sm" onClick={e => this.delete(banco.codigoSbif)}>Eliminar</Button>
                                                            </td>
                                                        </tr>
                                                    ))
                            */
                            this.props.bancos.map((banco, i) => (

                                <tr key={i}>
                                    <td>{banco.nombre}</td>
									<td>{banco.codigoSbif}</td>
                                    <td>{banco.Activo}</td>
                                    <td>
                                        <Button color="info" size="sm" onClick={e => this.onEdit(banco)}>Editar</Button>
                                        <Button color="danger" size="sm" onClick={e => this.delete(banco.codigoSbif)}>Eliminar</Button>
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


export default class Banco extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/banco/consulta/lista';
    UrlAgregar = this.props.LocalHost + '/sta/application/banco/agregar/';
    UrlElimina = this.props.LocalHost + '/sta/application/banco/eliminar/';
    UrlModificar = this.props.LocalHost + '/sta/application/banco/modificar/';

    state = {
        bancos: [],
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
            .then(bancos => this.setState({ bancos }))
            //.then(bancos => console.log(bancos))
            .catch(e => console.log(e));
    }

    save = (banco) => {
        let data = {
            idbanco: banco.idbanco,
            codigoSbif: banco.codigoSbif,
            nombre: banco.nombre,
            Activo: banco.Activo
        };

        //console.log(data);
        const requestInfo = {
            method: data.codigoSbif !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        if (data.idbanco === 0) {
            // CREATE NEW BANCO   /banco/agregar/{codigoSbif}/{nombre}
            //fetch(this.UrlAgregar + data.codigoSbif + "/" + data.nombre, requestInfo)
            fetch(`${this.UrlAgregar}${data.codigoSbif}/${data.nombre}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(newBanco => {
                    let { bancos } = this.state;
                    bancos.push(data);
                    this.setState({ bancos, message: { text: 'Nuevo banco ingresado!', alert: 'success' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        } else {
            // EDIT BANCO
            //fetch(`${this.UrlModificar}/${data.codigoSbif}`, requestInfo)
            ///banco/modificar/{codigoSbif}/{nombre}/{activo}

            fetch(`${this.UrlModificar}${data.codigoSbif}/${data.nombre}/${data.Activo}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(updatedBanco => {
                    let { bancos } = this.state;
                    let position = bancos.findIndex(banco => banco.codigoSbif === data.codigoSbif);
                    console.log("position : " + position);

                    bancos[position] = data;
                    this.setState({ bancos, message: { text: 'Banco modificado correctamente!', alert: 'info' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        }
    }

    //elimina banco

    delete = (codigoSbif) => {

        let data = {
            codigoSbif: Number(codigoSbif)
        };

        const requestInfo = {
            method: data.codigoSbif !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        fetch(`${this.UrlElimina}${codigoSbif}`, requestInfo, { mode: 'cors' })
            .then(response => response.json())
            .then(rows => {
                const bancos = this.state.bancos.filter(banco => banco.codigoSbif !== codigoSbif);
                this.setState({ bancos, message: { text: 'Banco eliminado correctamente.', alert: 'danger' } });
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
                        <h2 className="font-weight-bold text-center"> Lista de Bancos </h2>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-8 my-3">

                    </div>
                    <div className="col-md-4 my-3" align="right">
                        <Button onClick={this.togglePopup.bind(this)} color="primary" >Crear Banco</Button>
                    </div>

                </div>
                <div className="row">



                    <div className="col-md-12 my-3">
                        <ListBancos bancos={this.state.bancos} deleteBanco={this.delete} closePopup={this.togglePopup.bind(this)} />
                    </div>
                </div>

                {this.state.showPopup ?
                    <div className='popup'>
                        <div className='popup_inner'>
                            <h2 className="font-weight-bold text-center"> Edición de Banco </h2>
                            <FormBanco bancoCreate={this.save} closePopup={this.togglePopup.bind(this)} />


                        </div>

                    </div>
                    : null
                }

            </div>
        );
    }


}

