import React, { Component } from 'react';
import { withRouter, matchPath } from 'react-router';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './App.css';
import './animations/DashboardExit.css';
import './animations/DashboardEnter.css';
import './grid-16.css';

import Auth from './openid-connect/Auth.js';
import LoadingIndicator from './shared/LoadingIndicator.js';

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

function setRollbarContext(context) {
  Rollbar.configure({
    payload: {
      context
    }
  });
}

const routes = [
  // can combine paths into array once react-router-dom is at least v4.4.x (or v5.0.0 as per distributor)
  { path: '/', name: 'home', Component: ConnectedDashboard },
  { path: '/dashboard', name: 'dashboard', Component: ConnectedDashboard },
  { path: '/viewer', name: 'viewer', Component: ConnectedViewer },
  {
    path: '/session-summary',
    name: 'summary',
    Component: ConnectedSessionSummary
  },
  { path: '/screenshot-qa', name: 'qa', Component: ScreenshotQA },
  { path: '/leaderboard', name: 'leaderboard', Component: Leaderboard },
  { path: '/stats', name: 'stats', Component: StatisticsPage }
];

const getComponent = (Component, props, componentsReady) => {
  return componentsReady ? <Component {...props} /> : <LoadingIndicator />;
};

const firstPassAuthConfig = (props, setComponentsReadyCallback) => {
  const { auth, store, location } = props;
  const authenticated = auth.isAuthenticated();
  const hasSignInResponse = Auth.urlHasSignInResponse();

  if (!authenticated && !hasSignInResponse) {
    const { pathname } = location;
    auth.login({ redirect_uri: Auth.absoluteURL(pathname) });
  } else if (!authenticated && hasSignInResponse) {
    auth.handleAuthentication().then(async () => {
      // User is Authenticated, update the Redux store
      // with the user information
      store.dispatch({
        type: 'SET_FROM_DATABASE',
        savedState: {
          username: auth.profile.username,
          occupation: auth.profile.occupation,
          team: auth.profile.team,
          experience: auth.profile.experience
        }
      });

      setComponentsReadyCallback();
    });
  }
};
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      componentsReady: false
    };

    this.historyListen = undefined;
  }

  componentWillMount() {
    this.historyListen = this.props.history.listen((location, action) => {
      setRollbarContext(window.location.pathname);
    });
  }

  componentDidMount() {
    const { auth, store, location } = this.props;

    firstPassAuthConfig({ auth, store, location }, () => {
      this.setState({
        componentsReady: true
      });
    });

    LogoutTimeoutService.init();
  }

  componentWillUnmount() {
    if (typeof this.historyListen === 'function') {
      this.historyListen();
    }

    LogoutTimeoutService.destroy();
  }

  render() {
    const {
      auth,
      store,
      location: { pathname }
    } = this.props;
    const { componentsReady } = this.state;

    const notFoundRoute = !routes.find(route =>
      matchPath(pathname, {
        path: route.path,
        exact: true
      })
    );

    return (
      <Router>
        <div className="route-container">
          <section className="route-section">
            {routes.map(({ path, Component, HOC }) => (
              <Route key={path} exact path={path}>
                {({ match }) => (
                  <CSSTransition
                    in={match !== null}
                    timeout={{ enter: 2000, exit: 1000 }}
                    classNames="fade"
                    appear
                    unmountOnExit
                  >
                    {getComponent(Component, { auth, store }, componentsReady)}
                  </CSSTransition>
                )}
              </Route>
            ))}
            <Route path="/silent-refresh.html" onEnter={reload} />
            <Route path="/logout-redirect.html" onEnter={reload} />
            {/*<Route exact path="/playground" component={TestPage} />*/}
            {notFoundRoute && (
              <Route
                render={() => <div> Sorry, this page does not exist. </div>}
              />
            )}
          </section>
        </div>
      </Router>
    );
  }
}

export default withRouter(App);
