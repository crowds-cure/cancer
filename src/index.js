import '@babel/polyfill';
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import './url.js';
import './ie.js';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import rootReducer from './state/reducers';

import App from './App';
import * as serviceWorker from './serviceWorker';
import Auth from './openid-connect/Auth.js';

const auth = new Auth();

// TODO: Probably a better way to do this
window.auth = auth;

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store} auth={auth}>
    <BrowserRouter>
      <App store={store} auth={auth} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
