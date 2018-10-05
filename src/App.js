import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';

import Dashboard from './Dashboard.js';
import Viewer from './Viewer.js';

class App extends Component {
  render() {
    return (
      <div>
        {
          <nav>
            <Link to="/viewer">Viewer</Link>
          </nav>
        }
        <div>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/viewer" component={Viewer} />
        </div>
      </div>
    );
  }
}

export default App;
