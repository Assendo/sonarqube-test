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

class ListCuadratura extends Component {

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
        console.log("[Cuadratura.js] fecha: " + this.hoyFecha());

        this.setState({ model: { ...this.state.model, fecha: this.hoyFecha() } });
    }

    listar = () => {
        console.log("[Cuadratura.js] Fecha de busqueda: " + this.state.model.fecha);
        let fx = this.state.model.fecha.replace("-", "").replace("-", "");
        this.props.ListarPagina1(fx);
		this.props.ListarPagina2(fx);
    }

    render() {
        const { ciclo1 } = this.props;
        console.log(ciclo1)

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
				<Label>CARGA ABONO EN IBS (1er ciclo: 14:00 a 22:20)</Label>
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>&nbsp;</th>
                            <th>Cantidad Archivos</th>
                            <th>Cantidad Registros</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.ciclo1.map((cuadratura1, i) => (

                                <tr key={i}>
                                    <td>{cuadratura1.glosa}</td>
                                    <td>{cuadratura1.cantArchivos}</td>
                                    <td>{cuadratura1.totRegistros}</td>
                                </tr>
                            ))


                        }
                    </tbody>
                </Table>
				<br/>
				<Label>CARGA ABONO INTRADIA (2do ciclo: 00:30 a 08:10)</Label>
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>&nbsp;</th>
                            <th>Cantidad Archivos</th>
                            <th>Cantidad Registros</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.ciclo2.map((cuadratura2, i) => (

                                <tr key={i}>
                                    <td>{cuadratura2.glosa}</td>
                                    <td>{cuadratura2.cantArchivos}</td>
                                    <td>{cuadratura2.totRegistros}</td>
                                </tr>
                            ))


                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}


export default class Cuadratura extends Component {

    UrlCiclo1 = this.props.LocalHost + '/sta/application/archivo/consulta/cuadratura/ciclo1/';//{fecha}
	UrlCiclo2 = this.props.LocalHost + '/sta/application/archivo/consulta/cuadratura/ciclo2/';//{fecha}

    state = {
        ciclo1: [],
		ciclo2: [],
        message: {
            text: '',
            alert: ''
        }
    }

    componentDidMount() {
        this.Listar1("20190910"); //06,10,16
    }

    //añomesdia
    Listar1 = (fecha1) => {
        console.log("[Cuadratura.js] Busqueda por fecha ciclo 1:" + fecha1);
		
		const requestInfoGet = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };
		
        fetch(this.UrlCiclo1 + fecha1, requestInfoGet, { mode: 'cors' })
            .then(response => response.json())
            .then(ciclo1 => this.setState({ ciclo1 }))
            //.then(archivos => console.log(archivos))
            .catch(e => console.log(e));
    }
	
	Listar2 = (fecha1) => {
        console.log("[Cuadratura.js] Busqueda por fecha ciclo 2:" + fecha1);
		
		const requestInfoGet = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };
		
        fetch(this.UrlCiclo2 + fecha1, requestInfoGet, { mode: 'cors' })
            .then(response => response.json())
            .then(ciclo2 => this.setState({ ciclo2 }))
            //.then(archivos => console.log(archivos))
            .catch(e => console.log(e));
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
                        <h2 className="font-weight-bold text-center"> Cuadratura Carga Previa IBS </h2>
                        <ListCuadratura ciclo1={this.state.ciclo1} ciclo2={this.state.ciclo2} ListarPagina1={this.Listar1} ListarPagina2={this.Listar2}/>
                    </div>
                </div>
            </div>
        );
    }


}

