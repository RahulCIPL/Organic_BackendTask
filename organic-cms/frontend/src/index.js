import React from 'react';
import ReactDOM from 'react-dom';
//Include bootstarp CSS
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import axios from 'axios';

//API server base URL
axios.defaults.baseURL = 'http://localhost:5000';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);