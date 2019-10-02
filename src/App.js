import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import SecretRoute from './SecretRoute.js';
import './App.css';
import './AppPageAnimations.css';
import './grid-16.css';

import Rollbar from './shared/ErrorHandling.js';
import ConnectedDashboard from './ConnectedDashboard.js';
import ConnectedViewer from './ConnectedViewer.js';
import ConnectedSessionSummary from './ConnectedSessionSummary.js';
import ScreenshotQA from './ScreenshotQA.js';
import Leaderboard from './Leaderboard.js';
import StatisticsPage from './StatisticsPage.js';
import LogoutTimeoutService from './LogoutTimeoutService.js';
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
  componentWillMount() {
    console.warn('>>>>DID_MOUNT');
    this.unlisten = this.props.history.listen((location, action) => {
      console.warn('>>>>CAPTURED', location);
      setContext(window.location.pathname);
    });

    LogoutTimeoutService.init();
  }

  componentWillUnmount() {
    this.unlisten();

    LogoutTimeoutService.destroy();
  }

  render() {
    const location = this.props.location;
    const currentKey = location.pathname.split('/')[1] || '/';

    return (
      <Router>
        <TransitionGroup className="transition-group">
          <CSSTransition
            key={currentKey}
            timeout={{ enter: 2000, exit: 1000 }}
            classNames={'fade'}
            appear
          >
            <section className="route-section">
              <Switch location={location}>
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
                <Route
                  render={() => <div> Sorry, this page does not exist. </div>}
                />
              </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      </Router>
    );
  }
}

export default withRouter(App);
