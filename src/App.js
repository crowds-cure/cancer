import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import Dashboard from './Dashboard.js';
import Viewer from './Viewer.js';
import SessionSummary from './SessionSummary.js';

class App extends Component {
  render() {
    return (
      <>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/viewer" component={Viewer} />
        <Route exact path="/session-summary" component={SessionSummary} />
      </>
    );
  }
}

export default App;
