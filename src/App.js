import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import SecretRoute from './SecretRoute.js';
import './App.css';

import Dashboard from './Dashboard.js';
import Viewer from './Viewer.js';
import SessionSummary from './SessionSummary.js';

const reload = () => window.location.reload();

class App extends Component {
  render() {
    const auth = this.props.auth;

    return (
      <Switch>
        <SecretRoute
          exact
          path="/dashboard"
          component={Dashboard}
          auth={auth}
        />
        <SecretRoute exact path="/" component={Dashboard} auth={auth} />
        <SecretRoute exact path="/viewer" component={Viewer} auth={auth} />
        <SecretRoute
          exact
          path="/session-summary"
          component={SessionSummary}
          auth={auth}
        />
        <Route path="/silent-refresh.html" onEnter={reload} />
        <Route path="/logout-redirect.html" onEnter={reload} />
        <Route render={() => <div> Sorry, this page does not exist. </div>} />
      </Switch>
    );
  }
}

export default App;
