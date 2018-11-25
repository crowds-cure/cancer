import { Component } from 'react';
import React from 'react';
import AutoLogoutCountdown from './AutoLogoutCountdown.js';
import Button from './Button.js';
import PropTypes from 'prop-types';
import './LogoutSection.css';

class LogoutSection extends Component {
  constructor(props) {
    super(props);

    this.handleClickDashboard = this.handleClickDashboard.bind(this);
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired
      }).isRequired,
      staticContext: PropTypes.object
    }).isRequired
  };

  render() {
    const timeLeft = 30;

    return (
      <div className="LogoutSection row justify-content-center">
        <div className="col-sm-16 col-md-auto">
          <AutoLogoutCountdown timeLeft={timeLeft} />
        </div>
        <div className="col-sm-16 col-md-auto">
          <Button label="Dashboard" click={this.handleClickDashboard} />
          <Button label="Log out now" click={this.handleClickLogout} />
        </div>
      </div>
    );
  }

  handleClickDashboard = () => {
    this.context.store.dispatch({
      type: 'RESET_SESSION'
    });

    this.context.router.history.push('/');
  };

  handleClickLogout() {
    window.auth.logout();
  }
}

export default LogoutSection;
