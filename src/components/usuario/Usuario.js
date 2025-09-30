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


class FormUsuario extends Component {

    //{codigoUsuario}/{nombre}/{apellidop}/{apellidom}/{codigoPerfil}/{codigoEstado}
    state = {
        model: {
            idusuario: 0,
            codigoEstado: '',
            nombre: '',
            apellidop: '',
            perfil: '',
            codigoPerfil: '',
            estadoUsuario: '',
            apellidom: '',
            codigoUsuario: ''
        }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    create = () => {
        this.setState({
            model: {
                idusuario: 0,
                codigoEstado: '',
                nombre: '',
                apellidop: '',
                perfil: '',
                codigoPerfil: '',
                estadoUsuario: '',
                apellidom: '',
                codigoUsuario: ''
            }
        })

        this.props.usuarioCreate(this.state.model);

        console.log("[Usuario.js] idusuario : " + this.state.model.idusuario);
        console.log("[Usuario.js] codigoEstado : " + this.state.model.codigoEstado);
        console.log("[Usuario.js] nombre : " + this.state.model.nombre);
        console.log("[Usuario.js] apellidop : " + this.state.model.apellidop);
        console.log("[Usuario.js] perfil : " + this.state.model.perfil);
        console.log("[Usuario.js] codigoPerfil : " + this.state.model.codigoPerfil);
        console.log("[Usuario.js] estadoUsuario : " + this.state.model.estadoUsuario);
        console.log("[Usuario.js] apellidom : " + this.state.model.apellidom);
        console.log("[Usuario.js] codigoUsuario : " + this.state.model.codigoUsuario);

    }

    componentWillMount() {
        PubSub.subscribe('edit-usuario', (topic, usuario) => {
            this.setState({ model: usuario });
        });
    }

    ElijeEnDropdown = (nombre, codigo, descripcion) => {

        console.log("[Usuario.js] codigo dorpdown : " + codigo + " " + descripcion);

        if (nombre === "perfiles"){
            this.setState({ model: { ...this.state.model, perfil: descripcion, codigoPerfil: codigo } });
        }else{
            this.setState({ model: { ...this.state.model, estadoUsuario: descripcion, codigoEstado: codigo } });
        }

    }

    render() {
        return (
            <Form>

                <Table className="table-bordered text-center">

                    <tr>
                        <td>Nombre</td>
                        <td><Input id="nombre" type="text"
                            value={this.state.model.nombre} placeholder="Nombre usuario..."
                            onChange={e => this.setValues(e, 'nombre')} /></td>
                    </tr>
                    <tr>
                        <td>Apellido P</td>
                        <td><Input id="apellidop" type="text"
                            value={this.state.model.apellidop} placeholder="Apellido Paterno..."
                            onChange={e => this.setValues(e, 'apellidop')} /></td>
                    </tr>
                    <tr>
                        <td>Apellido M</td>
                        <td><Input id="apellidom" type="text"
                            value={this.state.model.apellidom} placeholder="Apellido Materno..."
                            onChange={e => this.setValues(e, 'apellidom')} /></td>
                    </tr>
                    <tr>
                        <td>Codigo Usuario</td>
                        <td><Input id="codigoUsuario" type="text"
                            value={this.state.model.codigoUsuario} placeholder="Codigo Usuario..."
                            onChange={e => this.setValues(e, 'codigoUsuario')} /></td>
                    </tr>
                    <tr>
                        <td>Perfil</td>
                        <td>
                            <div className="form-inline">
                                <Input id="perfil" type="text"
                                    value={this.state.model.perfil} placeholder="Perfil..."
                                    onChange={e => this.setValues(e, 'perfil')} />

                                <div style={{ display: 'flex', justifyContent: 'center' }} >
                                    <Dropdown nombre="perfiles" perfiles={this.props.perfiles} ElijeEnDropdown={this.ElijeEnDropdown} />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Codigo Perfil</td>
                        <td><Input id="codigoPerfil" type="text"
                            value={this.state.model.codigoPerfil} placeholder="Codigo Perfil..."
                        /></td>
                    </tr>
                    <tr>
                        <td>Estado Usuario</td>
                        <td>
                            <div className="form-inline">
                                <Input id="estadoUsuario" type="text"
                                    value={this.state.model.estadoUsuario} placeholder="Estado Usuario..."
                                    onChange={e => this.setValues(e, 'estadoUsuario')} />

                                <div style={{ display: 'flex', justifyContent: 'center' }} >
                                    <Dropdown nombre="estadousuario" perfiles={this.props.estadousuario} ElijeEnDropdown={this.ElijeEnDropdown} />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Codigo Estado</td>
                        <td><Input id="codigoEstado" type="text"
                            value={this.state.model.codigoEstado} placeholder="Codigo de Estado..."
                        /></td>
                    </tr>

                </Table>


                <Button color="primary" block onClick={this.create}> Grabar </Button>
            </Form>
        );
    }
}


class ListUsuarios extends Component {
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
        this.props.deleteUsuario(codigo);
    }

    onEdit = (usuario) => {

        this.setState({ usuario: { idusuario: 1 } })

        PubSub.publish('edit-usuario', usuario);
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
        const { usuarios } = this.props;

        //const elements = ['1', '2', '3'];
        //elements.push('9');
        const elements = [];

        this.props.usuarios.slice(0, 1).map((usuario, i) => (
            //console.log("Pagina de render : " + usuario.cantPags)
            this.onTotPag(usuario.cantPags)
        ))

        const pi = this.pagxtot;
        //ejemplo
        const people = ["Rowe", "Prevost", "Gare"];
        let peopleToReturn = [];

        const peopleLis = () => {
            for (let i = 0; i < people.length; i++) {
                peopleToReturn.push(<li> {people[i]}</li>);
            }
            return peopleToReturn;
        };

        //array
        for (let i = 0; i < this.pagxtot; i++) {
            console.log(i);
            let pag = i;
            pag = pag + 1;
            elements.push("" + pag + "");
        }

        return (


            <div>
                <h5 align="left">Paginas</h5>
                <ul className="pagination">
                    {elements.map((value, index) => {
                        return <li className="page-item" key={index}>
                            <button onClick={() => this.listar(value)}>
                                {value}
                            </button></li>
                    })}
                </ul>


                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Accion</th>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Apellido Paterno</th>
                            <th>Apellido Materno</th>
                            <th>Perfil</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.usuarios.map((usuario, i) => (


                                <tr key={i}>
                                    <td>
                                        <Button color="info" size="sm" onClick={e => this.onEdit(usuario)}>Editar</Button>
                                        <Button color="danger" size="sm" onClick={e => this.delete(usuario.codigoUsuario)}>Eliminar</Button>
                                    </td>
                                    <td>{usuario.codigoUsuario}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.apellidop}</td>
                                    <td>{usuario.apellidom}</td>
                                    <td>{usuario.perfil}</td>
                                    <td>{usuario.estadoUsuario}</td>
                                </tr>
                            ))


                        }
                    </tbody>
                </Table>


            </div>
        );
    }
}


export default class Usuario extends Component {
//localstorage

    UrlLista = this.props.LocalHost + '/sta/application/usuario/consulta/pagina/';//pagina
    UrlListaUs = this.props.LocalHost + '/sta/application/usuario/consulta/';//codigoUsuario
    UrlAgregar = this.props.LocalHost + '/sta/application/usuario/agregar/';//{codigoUsuario}/{nombre}/{apellidop}/{apellidom}/{codigoPerfil}/{codigoEstado}
    UrlModificar = this.props.LocalHost + '/sta/application/usuario/modificar/';//{codigoUsuario}/{nombre}/{apellidop}/{apellidom}/{codigoPerfil}/{codigoEstado}
    UrlElimina = this.props.LocalHost + '/sta/application/usuario/eliminar/';//{codigoUsuario}
    UrlListaPerfiles = this.props.LocalHost + '/sta/application/perfilusuario/consulta/lista/';
    UrlListaEstadoUsuario = this.props.LocalHost + '/sta/application/estadousuario/consulta/lista/';

    state = {
        usuarios: [],
        perfiles: [],
        estadousuario: [],
        message: {
            text: '',
            alert: ''
        }
    }

    componentDidMount() {
        this.Listar(1);
        this.ListaPerfiles();
        this.ListaEstados();
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
            .then(usuarios => this.setState({ usuarios }))
            //.then(usuarios => console.log(usuarios))
            .catch(e => console.log(e));
    }

    ListaPerfiles = () => {
		const requestInfoGet = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };
		
        fetch(this.UrlListaPerfiles, requestInfoGet, { mode: 'cors' })
            .then(response => response.json())
            .then(perfiles => this.setState({ perfiles }))
            .catch(e => console.log(e));
    }

    ListaEstados = () => {
		const requestInfoGet = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };
		
        fetch(this.UrlListaEstadoUsuario, requestInfoGet, { mode: 'cors' })
            .then(response => response.json())
            .then(estadousuario => this.setState({ estadousuario }))
            .catch(e => console.log(e));
    }


    /*
        <td>{usuario.codigoEstado}</td>
        <td>{usuario.nombre}</td>
        <td>{usuario.apellidop}</td>
        <td>{usuario.perfil}</td>
        <td>{usuario.codigoPerfil}</td>
        <td>{usuario.estadoUsuario}</td>
        <td>{usuario.apellidom}</td>
        <td>{usuario.codigoUsuario}</td>
    */

    save = (usuario) => {
        let data = {
            idusuario: usuario.idusuario,
            codigoEstado: usuario.codigoEstado,
            nombre: usuario.nombre,
            apellidop: usuario.apellidop,
            perfil: usuario.perfil,
            codigoPerfil: usuario.codigoPerfil,
            estadoUsuario: usuario.estadoUsuario,
            apellidom: usuario.apellidom,
            codigoUsuario: usuario.codigoUsuario
        };

        //console.log(data);
        const requestInfo = {
            method: data.codigoUsuario !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        //{nombre}/{apellidop}/{apellidom}/{codigoPerfil}/{codigoEstado}
        if (data.idusuario === 0) {
            fetch(`${this.UrlAgregar}${data.codigoUsuario}/${data.nombre}/${data.apellidop}/${data.apellidom}/${data.codigoPerfil}/${data.codigoEstado}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(newUsuario => {
                    let { usuarios } = this.state;
                    usuarios.push(data);
                    this.setState({ usuarios, message: { text: 'Nueva Usuario ingresada!', alert: 'success' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        } else {
            fetch(`${this.UrlModificar}${data.codigoUsuario}/${data.nombre}/${data.apellidop}/${data.apellidom}/${data.codigoPerfil}/${data.codigoEstado}`, requestInfo, { mode: 'cors' })
                .then(response => response.json())
                .then(updatedUsuario => {
                    let { usuarios } = this.state;
                    let position = usuarios.findIndex(usuario => usuario.codigoUsuario === data.codigoUsuario);
                    console.log("position : " + position);

                    usuarios[position] = data;
                    this.setState({ usuarios, message: { text: 'usuario modificada correctamente!', alert: 'info' } });
                    this.timerMessage(3000);
                })
                .catch(e => console.log(e));
        }
    }

    //elimina usuario

    delete = (codigoUsuario) => {

        let data = {
            codigoUsuario: Number(codigoUsuario)
        };

        const requestInfo = {
            method: data.codigoUsuario !== 0 ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };

        fetch(`${this.UrlElimina}${codigoUsuario}`, requestInfo, { mode: 'cors' })
            .then(response => response.json())
            .then(rows => {
                const usuarios = this.state.usuarios.filter(usuario => usuario.codigoUsuario !== codigoUsuario);
                this.setState({ usuarios, message: { text: 'Usuario eliminada correctamente.', alert: 'danger' } });
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

                <div className="col-md-12">
                    <h2 className="font-weight-bold text-center"> Edición de Usuarios </h2>
                    <FormUsuario usuarioCreate={this.save} perfiles={this.state.perfiles} estadousuario={this.state.estadousuario} />
                </div>
                <br/>
                <div className="col-md-12">
                    <h2 className="font-weight-bold text-center"> Lista de Usuarios </h2>
                    <ListUsuarios ListarPagina={this.Listar} usuarios={this.state.usuarios} deleteUsuario={this.delete} />
                </div>

            </div>
        );
    }
}


