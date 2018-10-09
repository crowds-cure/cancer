import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Auth from './openid-connect/Auth.js';

class SecretRoute extends Component {
  constructor(props) {
    super(props);

    const auth = this.props.auth;
    const authenticated = auth.isAuthenticated();
    const hasSignInResponse = Auth.urlHasSignInResponse();
    if (!authenticated && !hasSignInResponse) {
      auth.login({ redirect_uri: Auth.absoluteURL(props.path) });
    } else if (!authenticated && hasSignInResponse) {
      auth.handleAuthentication().then(() => {
        // Call setState to force a re-render
        this.setState({
          test: 'xyz'
        });
      });
    }
  }

  render() {
    const { component: Component, auth, ...rest } = this.props;

    // TODO: Replace 'Loading...' with
    // a real loading page
    return (
      <Route
        {...rest}
        render={props =>
          auth.isAuthenticated() === true ? (
            <Component {...props} />
          ) : (
            'Loading...'
          )
        }
      />
    );
  }
}

export default SecretRoute;
