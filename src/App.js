import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import Dashboard from './Dashboard.js';
import Viewer from './Viewer.js';

class App extends Component {
  render() {
    return (
      <>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/viewer" component={Viewer} />
      </>
    );
  }
}

export default App;
