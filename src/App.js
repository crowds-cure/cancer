import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import SecretRoute from './SecretRoute.js';
import './App.css';
import './grid-16.css';

import Rollbar from './shared/ErrorHandling.js';
import ConnectedDashboard from './ConnectedDashboard.js';
import ConnectedViewer from './ConnectedViewer.js';
import ConnectedSessionSummary from './ConnectedSessionSummary.js';
import ScreenshotQA from './ScreenshotQA.js';
import Leaderboard from './Leaderboard.js';
import StatisticsPage from './StatisticsPage.js';
//import TestPage from './TestPage.js';

const reload = () => window.location.reload();

function setContext(context) {
  Rollbar.configure({
    payload: {
      context
    }
  });
}

class App extends Component {
  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      setContext(window.location.pathname);
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

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
        <SecretRoute
          exact
          path="/leaderboard"
          component={Leaderboard}
          auth={this.props.auth}
          store={this.props.store}
        />
        <SecretRoute
          exact
          path="/stats"
          component={StatisticsPage}
          auth={this.props.auth}
          store={this.props.store}
        />
        <Route path="/silent-refresh.html" onEnter={reload} />
        <Route path="/logout-redirect.html" onEnter={reload} />
        {/*<Route exact path="/playground" component={TestPage} />*/}
        <Route render={() => <div> Sorry, this page does not exist. </div>} />
      </Switch>
    );
  }
}

export default withRouter(App);
