import React, { Component } from 'react';
import * as $ from 'jquery';
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

class ListArchivosProcesados extends React.Component {
	constructor() {
		super();
		this.state = {
			elements: [],
			currentPage: 1,
			todosPerPage: 1,
			upperPageBound: 3,
			lowerPageBound: 0,
			isPrevBtnActive: 'disabled',
			isNextBtnActive: '',
			pageBound: 3,
			model: {
				pag: 1,
				pagCant: 5,
				fecha: ''
			},
		};
		this.handleClick = this.handleClick.bind(this);
		this.btnDecrementClick = this.btnDecrementClick.bind(this);
		this.btnIncrementClick = this.btnIncrementClick.bind(this);
		this.btnNextClick = this.btnNextClick.bind(this);
		this.btnPrevClick = this.btnPrevClick.bind(this);
		// this.componentDidMount = this.componentDidMount.bind(this);
		this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
	}
	
	hoyFecha = () => {
        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;
        var yyyy = hoy.getFullYear();

        dd = this.addZero(dd);
        mm = this.addZero(mm);
		this.state.model.fecha = yyyy+mm+dd;
		console.log("fechaHoy: " + this.state.model.fecha);
        return yyyy + '-' + mm + '-' + dd;
    }
	//INICIO CODIGO EN DESARROLLO
	componentDidUpdate() {
    	$("button").removeClass('button_selpag');
        $('button#'+this.state.currentPage).addClass('button_selpag');
	}
    handleClick(event) {
        let listid = Number(event.target.id);
        this.setState({
          currentPage: listid
        });
        $("button").removeClass('button_selpag');
        $('button#'+listid).addClass('button_selpag');
        this.setPrevAndNextBtnClass(listid);
		this.listar(listid, this.state.model.fecha);
    }
    setPrevAndNextBtnClass(listid) {
        let totalPage = this.pagxtot;
        this.setState({isNextBtnActive: 'disabled'});
        this.setState({isPrevBtnActive: 'disabled'});
        if(totalPage === listid && totalPage > 1){
            this.setState({isPrevBtnActive: ''});
        }
        else if(listid === 1 && totalPage > 1){
            this.setState({isNextBtnActive: ''});
        }
        else if(totalPage > 1){
            this.setState({isNextBtnActive: ''});
            this.setState({isPrevBtnActive: ''});
        }
    }
    btnIncrementClick() {
        this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
        this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
        let listid = this.state.upperPageBound + 1;
        this.setState({ currentPage: listid});
        this.setPrevAndNextBtnClass(listid);
		this.listar(listid, this.state.model.fecha);
    }
    btnDecrementClick() {
        this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
        this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
        let listid = this.state.upperPageBound - this.state.pageBound;
        this.setState({ currentPage: listid});
        this.setPrevAndNextBtnClass(listid);
		this.listar(listid, this.state.model.fecha);
    }
    btnPrevClick() {
        if((this.state.currentPage -1)%this.state.pageBound === 0 ){
            this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
            this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
        }
        let listid = this.state.currentPage - 1;
        this.setState({ currentPage : listid});
        this.setPrevAndNextBtnClass(listid);
		this.listar(listid, this.state.model.fecha);
    }
    btnNextClick() {
        if((this.state.currentPage +1) > this.state.upperPageBound ){
            this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
            this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
        }
        let listid = this.state.currentPage + 1;
        this.setState({ currentPage : listid});
        this.setPrevAndNextBtnClass(listid);
		this.listar(listid, this.state.model.fecha);
    }
	//FIN CODIGO EN DESARROLLO

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


    listar = (NumPagina, fecha) => {
        //this.props.ListarPagina(this.state.model.pag);
		let fx = fecha.replace("-", "").replace("-", "");
        this.props.ListarPagina(NumPagina, fx);
    }
	
    buscar = (NumPagina, e) => {
		this.setValues(e, 'fecha')
        //this.props.ListarPagina(this.state.model.pag);
		let fx = this.state.model.fecha.replace("-", "").replace("-", "");
        this.props.ListarPagina(NumPagina, fx);
    }

    pagxtot = 0;
    onTotPag = (xpag) => {
		console.log("Paginas Totales: " + xpag);
        this.pagxtot = xpag;
    }
    componentDidMount() {
        this.setState({ model: { ...this.state.model, fecha: this.hoyFecha() } });
		//this.listar(this.state.currentPage, this.state.model.fecha);
    }
    render() {
		const { archivosProcesados } = this.props;

        //const elements = ['1', '2', '3'];
        //elements.push('9');
        const  { elements } = this.state;

        this.props.archivosProcesados.slice(0, 1).map((archivosProcesado, i) => (
            //console.log("Pagina de render : " + archivosProcesado.cantPags)
            this.onTotPag(archivosProcesado.cantPags)
        ))

        const pi = this.pagxtot;

        //array
        for (let i = 0; i < this.pagxtot; i++) {
            let pag = i;
            pag = pag + 1;
            elements.push("" + pag + "");
        }

        const { currentPage, todosPerPage,upperPageBound,lowerPageBound,isPrevBtnActive,isNextBtnActive } = this.state;
        // Logic for displaying current todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = elements.slice(indexOfFirstTodo, indexOfLastTodo);

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.pagxtot / todosPerPage); i++) {
          pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            if(number === 1 && currentPage === 1){
                return(
                    <div key={number} id={number}><button key={number} id={number} className="button_pag" onClick={this.handleClick}>{number}</button></div>
                )
            }
            else if((number < upperPageBound + 1) && number > lowerPageBound){
                return(
                    <div key={number} id={number}><button key={number} id={number} className="button_pag" onClick={this.handleClick}>{number}</button></div>
                )
            }
        });
        let pageIncrementBtn = null;
        if(pageNumbers.length > upperPageBound){
            pageIncrementBtn = <div className=''><button className="button_pag" onClick={this.btnIncrementClick}> &hellip; </button></div>
        }
        let pageDecrementBtn = null;
        if(lowerPageBound >= 1){
            pageDecrementBtn = <div className=''><button className="button_pag" onClick={this.btnDecrementClick}> &hellip; </button></div>
        }
        let renderPrevBtn = null;
        if(isPrevBtnActive === 'disabled') {
            renderPrevBtn = <div className={isPrevBtnActive}><span id="btnPrev"><button id="btnPrev" className="button_pag" disabled> Prev </button></span></div>
        }
        else{
            renderPrevBtn = <div className={isPrevBtnActive}><button id="btnPrev" className="button_pag" onClick={this.btnPrevClick}> Prev </button></div>
        }
        let renderNextBtn = null;
        if(isNextBtnActive === 'disabled') {
            renderNextBtn = <div className={isNextBtnActive}><span id="btnNext"><button id="btnNext" className="button_pag" disabled> Next </button></span></div>
        }
        else{
            renderNextBtn = <div className={isNextBtnActive}><button className="button_pag" onClick={this.btnNextClick}> Next </button></div>
        }

        return (
            <div>
						    <div align="center" className="row">
								<div className="col-md-6 my-6">
									<div className="form-inline">
										<FormGroup>
											<Label for="fecha1">Fecha de Busqueda : &nbsp;&nbsp;&nbsp;</Label>
											<Input id="fecha1" type="date" value={this.state.model.fecha} placeholder="fecha..."
												onChange={e => this.buscar('1', e)} />
										</FormGroup>
									</div>
								</div>
							</div>
				<ul className="pagination">
				  {renderPrevBtn}
				  {pageDecrementBtn}
				  {renderPageNumbers}
				  {pageIncrementBtn}
				  {renderNextBtn}
				</ul>
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Fecha Hora</th>
                            <th>Usuario</th>
                            <th>Acción</th>
                            <th>Archivo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.archivosProcesados.map((archivosProcesado, i) => (
                                <tr key={i}>
                                    <td>{archivosProcesado.fechaHora}</td>
                                    <td>{archivosProcesado.codigoUsuario}</td>
                                    <td>{archivosProcesado.accion}</td>
                                    <td>{archivosProcesado.nombreArchivo}</td>
                                    <td>{archivosProcesado.estadoArchivo}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}


export default class ArchivosProcesado extends Component {

    UrlLista = this.props.LocalHost + '/sta/application/archivo/consulta/procesados/';

    state = {
        archivosProcesados: [],
        message: {
            text: '',
            alert: ''
        }
    }

    Listar = (pagina, fecha) => {
		console.log("Listar (pagina): " + pagina);
		console.log("Listar (fecha): " + fecha);

        const requestInfoGet = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization' : JSON.parse(localStorage.getItem('token')),
                'Username': JSON.parse(localStorage.getItem('user'))
            })
        };
		
        fetch(this.UrlLista + pagina + "/" + fecha, requestInfoGet, { mode: 'cors' })
            .then(response => response.json())
            .then(archivosProcesados => this.setState({ archivosProcesados }))
            //.then(archivosProcesados => console.log(archivosProcesados))
            .catch(e => console.log(e));
    }

    render() {
        return (
            <div className="main">
                <div >
                    <div >
                        <h2 > Lista de Archivos Procesados </h2>
                        <ListArchivosProcesados ListarPagina={this.Listar} archivosProcesados={this.state.archivosProcesados} />
                    </div>
                </div>
            </div>
        );
    }
}