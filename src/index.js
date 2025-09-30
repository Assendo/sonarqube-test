import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './style/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// setup fake backend
//import { configureFakeBackend } from './_helpers';
//configureFakeBackend();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
