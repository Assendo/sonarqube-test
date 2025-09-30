import React, { Component } from 'react';
import Header from './components/header/Header';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import  Content  from './components/content/Content';
import ArchivosMonitoreo from "./components/monitoreo/ArchivosMonitoreo";

import { PrivateRoute } from './_components';
import { LoginPage } from './LoginPage';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      monitoreoAddr: "",
      loginAddr: ""
    }
  }

  render(){
    //const monitoreoAddr = window.location.protocol+"//"+window.location.hostname+":"+window.location.port+"/monitoreo";
    //const loginAddr = window.location.protocol+"//"+window.location.hostname+":"+window.location.port+"/login";
    //console.log("loginAddr: " + loginAddr);
    //console.log("monitoreoAddr: " + monitoreoAddr);
    return(
      <div id="app">
      <Router>
        <Header />
        <Switch>
          <PrivateRoute exact path="/" component={Content} />
          <PrivateRoute exact path="/monitoreo" component={ArchivosMonitoreo} />
          <Route exact path="/login" component={LoginPage} />
        </Switch>
      </Router>
      </div>
    );
  }
}

export default App;
