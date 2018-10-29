import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Auth from './openid-connect/Auth.js';
import LoadingIndicator from './shared/LoadingIndicator.js';

class SecretRoute extends Component {
  constructor(props) {
    super(props);

    const { auth, store } = props;
    const authenticated = auth.isAuthenticated();
    const hasSignInResponse = Auth.urlHasSignInResponse();

    if (!authenticated && !hasSignInResponse) {
      auth.login({ redirect_uri: Auth.absoluteURL(props.path) });
    } else if (!authenticated && hasSignInResponse) {
      auth.handleAuthentication().then(() => {
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

        // Call setState to force a re-render
        this.setState({
          test: 'xyz'
        });
      });
    }
  }

  render() {
    const { component: Component, auth, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          auth.isAuthenticated() === true ? (
            <Component {...props} />
          ) : (
            <LoadingIndicator />
          )
        }
      />
    );
  }
}

export default SecretRoute;
