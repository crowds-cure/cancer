import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import SecretRoute from './SecretRoute.js';
import './App.css';

import ConnectedDashboard from './ConnectedDashboard.js';
import ConnectedViewer from './ConnectedViewer.js';
import ConnectedSessionSummary from './ConnectedSessionSummary.js';

const reload = () => window.location.reload();

class App extends Component {
  render() {
    const auth = this.props.auth;

    return (
      <Switch>
        <SecretRoute
          exact
          path="/dashboard"
          component={ConnectedDashboard}
          auth={auth}
        />
        <SecretRoute
          exact
          path="/"
          component={ConnectedDashboard}
          auth={auth}
        />
        <SecretRoute
          exact
          path="/viewer"
          component={ConnectedViewer}
          auth={auth}
        />
        <SecretRoute
          exact
          path="/session-summary"
          component={ConnectedSessionSummary}
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
