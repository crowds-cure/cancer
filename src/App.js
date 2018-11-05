import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import SecretRoute from './SecretRoute.js';
import './App.css';
import './grid-16.css';

import ConnectedDashboard from './ConnectedDashboard.js';
import ConnectedViewer from './ConnectedViewer.js';
import ConnectedSessionSummary from './ConnectedSessionSummary.js';
import ScreenshotQA from './ScreenshotQA.js';

const reload = () => window.location.reload();

class App extends Component {
  render() {
    return (
      <Switch>
        <SecretRoute
          exact
          path="/dashboard"
          component={ConnectedDashboard}
          auth={this.props.auth}
          store={this.props.store}
        />
        <SecretRoute
          exact
          path="/"
          component={ConnectedDashboard}
          auth={this.props.auth}
          store={this.props.store}
        />
        <SecretRoute
          exact
          path="/viewer"
          component={ConnectedViewer}
          auth={this.props.auth}
          store={this.props.store}
        />
        <SecretRoute
          exact
          path="/session-summary"
          component={ConnectedSessionSummary}
          auth={this.props.auth}
          store={this.props.store}
        />
        <SecretRoute
          exact
          path="/screenshot-qa"
          component={ScreenshotQA}
          auth={this.props.auth}
          store={this.props.store}
        />
        <Route path="/silent-refresh.html" onEnter={reload} />
        <Route path="/logout-redirect.html" onEnter={reload} />
        <Route render={() => <div> Sorry, this page does not exist. </div>} />
      </Switch>
    );
  }
}

export default App;
