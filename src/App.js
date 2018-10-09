import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import SecretRoute from './SecretRoute.js';
import './App.css';

import Dashboard from './Dashboard.js';
import Viewer from './Viewer.js';
import SessionSummary from './SessionSummary.js';
import Callback from './openid-connect/Callback.js';

const reload = () => window.location.reload();

class App extends Component {
  render() {
    const auth = this.props.auth;

    return (
      <Switch>
        <Route exact path="/callback" render={() => <Callback auth={auth} />} />
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
        <Route render={() => <div> Sorry, this page does not exist. </div>} />
      </Switch>
    );
  }
}

export default App;
