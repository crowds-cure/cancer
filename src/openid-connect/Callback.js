import React from 'react';
import { withRouter } from 'react-router';

function Callback(props) {
  props.auth.handleAuthentication().then(() => {
    // TODO: Send the user to wherever they were going originally.
    props.history.push('/viewer');
  });

  return <div>Loading user profile.</div>;
}

export default withRouter(Callback);
