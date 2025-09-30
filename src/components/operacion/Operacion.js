import React, { Component } from 'react';
import PubSub from 'pubsub-js';//npm install --save pubsub-js
import './PaginarStyle.css';

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

class FormOperacion extends Component {

    state = {
        model: {
            idoperacion: 0,
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
        this.setState({ model: { idoperacion: 0, codigo: 0, descripcion: '' } })
        this.props.operacionCreate(this.state.model);

        console.log("[Operacion.js] idoperacion : " + this.state.model.idoperacion);
        console.log("[Operacion.js] codigo : " + this.state.model.codigo);
        console.log("[Operacion.js] descripcion : " + this.state.model.descripcion);

    }

    componentWillMount() {
        PubSub.subscribe('edit-operacion', (topic, operacion) => {
            this.setState({ model: operacion });
        });
    }

    render() {
        return (
            <Form>

                <FormGroup>
                    <Label for="descripcion">Descripción:</Label>
                    <Input id="descripcion" type="text" value={this.state.model.descripcion} placeholder="Descripción de operacion..."
                        onChange={e => this.setValues(e, 'descripcion')} />
                </FormGroup>

                <FormGroup>
                    <Label for="codigo">Código:</Label>
                    <Input id="codigo" type="text" value={this.state.model.codigo} placeholder="codigo de operacion..."
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


class ListOperacions extends Component {
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

    delete = (codigo) => {
        this.props.deleteOperacion(codigo);
    }



    onEdit = (operacion) => {

        this.setState({ operacion: { idoperacion: 1 } })

        operacion.idoperacion = 1;

        PubSub.publish('edit-operacion', operacion);
        this.props.closePopup();
    }



    /*
                    <FormGroup>
                        <Label for="pag">Nombre:</Label>
                        <Input id="pag" type="text" value={this.state.model.pag} placeholder="Pagina..."
                            onChange={e => this.setValues(e, 'pag')} />
    
                        <Button color="primary" block onClick={this.listar}> Buscar </Button>
                    </FormGroup>
    
    
                    <ul className="pagination">
                        <li className="page-item" onClick={this.listar()}>1</li>
                        <li className="page-item" ><a className="page-link"  href="#">2</a></li>
                        <li className="page-item" ><a className="page-link"  href="#">3</a></li>
                    </ul>
    
    
    
                    °°°°°°°°°°°°°ojo funciona esto
    
                             <ul className="pagination">
                        {elements.map((value, index) => {
                            return <li className="page-item" key={index}>          
                            <button onClick={() => this.listar(value)}>
                            {value}
                          </button></li>
                        })}
                        </ul>     
                        
    paginas
                        this.props.operacions.slice(0,1).map((operacion, i) => (
                        <FormGroup>
                        <Label for="paginas">pag:</Label>
                        <Input id="nompagbre" type="text" value={operacion.cantPags}
                            onChange={e => this.state.model.setValues(e, 'pagCant')} />
                        </FormGroup>
                         ))

                         this.onTotPag(operacion.cantPags)

                        this.props.operacions.slice(0,1).map((operacion, i) => (
                            <FormGroup>
                            <Label for="pagi">pag:</Label>
                            <Input id="pagi" type="text" value={operacion.cantPags}
                                onChange={ () => { this.onTotPag(operacion.cantPags)} } />
                            </FormGroup>
                             ))
    */

    listar = (NumPagina) => {
        this.props.ListarPagina(NumPagina);
    }

    pagxtot = 0;
    onTotPag = (xpag) => {
        this.pagxtot = xpag;
    }

    componentWillMount() {

    }




    render() {
        const { operacions } = this.props;

        //const elements = ['1', '2', '3'];
        //elements.push('9');
        const elements = [];

        this.props.operacions.slice(0, 1).map((operacion, i) => (
            //console.log("Pagina de render : " + operacion.cantPags)
            this.onTotPag(operacion.cantPags)
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

            // in render 


            <div>



                <h5 align="left">Paginas {this.pagxtot}</h5>
                <ul className="pagination">

                    <li className="page-item">
                        <button onClick={() => this.listar("ant")}>ant</button>
                    </li>

                    {elements.map((value, index) => {
                        return <li className="page-item" key={index}>
                            <button onClick={() => this.listar(value)}>
                                {value}
                            </button></li>
                    })}

                    <li className="page-item">
                        <button onClick={() => this.listar("sig")}>sig</button>
                    </li>
                </ul>

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
                            this.props.operacions.map((operacion, i) => (

                                <tr key={i}>
                                    <td>{operacion.descripcion}</td>
                                    <td>{operacion.codigo}</td>
                                    <td>
                                        <Button color="info" size="sm" onClick={e => this.onEdit(operacion)}>Editar</Button>
                                        <Button color="danger" size="sm" onClick={e => this.delete(operacion.codigo)}>Eliminar</Button>
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


export default class Operacion extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/operacion/consulta/pagina/';
    UrlAgregar = this.props.LocalHost + '/sta/application/operacion/agregar/';
    UrlElimina = this.props.LocalHost + '/sta/application/operacion/eliminar/';
    UrlModificar = this.props.LocalHost + '/sta/application/operacion/modificar/';

    state = {
        operacions: [],
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
            .then(operacions => this.setState({ operacions }))
            //.then(operacions => console.log(operacions))
            .catch(e => console.log(e));
    }

    save = (operacion) => {
        let data = {
            idoperacion: operacion.idoperacion,
            codigo: operacion.codigo,
            descripcion: operacion.descripcion,
            cantPags: operacion.cantPags
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

        if (data.idoperacion === 0) {
            fetch(`${this.UrlAgregar}${data.codigo}/${data.descripcion}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(newOperacion => {
                    let { operacions } = this.state;
                    operacions.push(data);
                    this.setState({ operacions, message: { text: 'Nueva Operacion ingresada!', alert: 'success' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        } else {
            fetch(`${this.UrlModificar}${data.codigo}/${data.descripcion}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(updatedOperacion => {
                    let { operacions } = this.state;
                    let position = operacions.findIndex(operacion => operacion.codigo === data.codigo);
                    console.log("position : " + position);

                    operacions[position] = data;
                    this.setState({ operacions, message: { text: 'operacion modificada correctamente!', alert: 'info' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        }
    }

    //elimina operacion

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
                const operacions = this.state.operacions.filter(operacion => operacion.codigo !== codigo);
                this.setState({ operacions, message: { text: 'Operacion eliminada correctamente.', alert: 'danger' } });
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
                        <h2 className="font-weight-bold text-center"> Lista de Operaciones </h2>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-8 my-3">

                    </div>
                    <div className="col-md-4 my-3" align="right">
                        <Button onClick={this.togglePopup.bind(this)} color="primary" >Crear Operacion</Button>
                    </div>

                </div>
                <div className="row">

                    <div className="col-md-12 my-3">
                        <ListOperacions ListarPagina={this.Listar} operacions={this.state.operacions} deleteOperacion={this.delete} closePopup={this.togglePopup.bind(this)} />
                    </div>
                </div>

                {this.state.showPopup ?
                    <div className='popup'>
                        <div className='popup_inner'>
                            <h2 className="font-weight-bold text-center"> Edición de Operacion </h2>
                            <FormOperacion operacionCreate={this.save} closePopup={this.togglePopup.bind(this)} />


                        </div>

                    </div>
                    : null
                }
            </div>
        );
    }
}


