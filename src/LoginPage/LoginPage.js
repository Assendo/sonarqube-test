import React from 'react';

import { userService } from '../_services';
import Content from '../components/content/Content';
import * as data from '../components/properties.json';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        userService.logout();

        this.state = {
            model: {
                usuario: 'error',
                token: 'null'
            },
            usernm: '',
            passwd: '',
            submitted: false,
            loading: false,
            error: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        // eslint-disable-next-li
        const { usernm, passwd, returnUrl } = this.state;

        // stop here if form is invalid
        if (!(usernm && passwd)) {
            return;
        }

        this.setState({ loading: true });

        /* Desarrollo Assendo. Comentar al pasar a banco PBN*/
		/* DESDE */
        /*
        userService.login(username, password)
            .then(
                user => {
                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                    this.props.history.push(from);
                },
                error => this.setState({ error, loading: false })
            );
        */
		/* HASTA */

        let datos = {
            username: usernm,
            password: passwd
        };

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        console.log("LoginPage window.webserver:" + window.webserver);
        fetch(window.webserver + '/sta/application/activedirectory/authenticate', requestInfo, { mode: 'cors' })
            .then(response => {
                if(!response.ok){
                    if (response.status === 404 || response.status === 405) {      
                        this.setState({ loading: false });
                        this.setState({ error: true });
                    }else{
                        return Promise.reject(response);
                    }
                }
                return response.json();
            })
            .then(response => { 
                if(response.username === undefined)  {
                    this.setState({ loading: false });
                    this.setState({ error: true });
                }else{ 
                    var x1 = response.username;
                    var x2 = response.token;
                    console.log("response.username : " + response.username);
                    console.log("response.token : " + response.token);
                    localStorage.setItem('user', JSON.stringify(x1));
                    localStorage.setItem('token', JSON.stringify(x2));
                    this.setState({ model: { ...this.state.model, usuario: x1, token: x2 } });
                }
            })
            /*.then(response => {
                var x1 = response.username;
                console.log("response.username : " + response.username);
                if(x1!="error"){
                    localStorage.setItem('user', JSON.stringify(x1));
                }else{
                    this.setState({ loading: false });
                    this.setState({ error: true });
                }
                this.setState({ model: { ...this.state.model, usuario: x1 } });
            })*/
    }

    render() {
        if (this.state.model.usuario === "error") {
            const { usernm, passwd, submitted, loading, error } = this.state;
            return (
                <div className="main-login">

                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className="login-box">
                            <label htmlFor="username">Usuario</label><br />
                            <input type="text" id="login-username" name="usernm" value={usernm} onChange={this.handleChange} />
                        </div>
                        <div className="login-box">
                            <label htmlFor="password">Contraseña</label><br />
                            <input type="password" id="login-password" name="passwd" value={passwd} onChange={this.handleChange} />
                        {submitted && error &&
                                <div >Nombre de usuario y/o contraseña incorrecto</div>
                        }
                        </div>
                        <br />
                        <div className="login-box">
                            <button id="login-button" disabled={loading}>Login</button>
                            {loading &&
                                <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            }
                        </div>
                    </form>
                </div>
            );
        } else {
            return (
                <div>
                    <Content LocalHost={window.webserver} />
                </div>
            );
        }
    }
}

export { LoginPage };