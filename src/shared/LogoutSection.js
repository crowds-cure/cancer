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
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired
      }).isRequired,
      staticContext: PropTypes.object
    }).isRequired
  };

  render() {
    return (
      <div className="LogoutSection">
        <AutoLogoutCountdown />
        <Button label="Dashboard" click={this.handleClickDashboard} />
        <Button label="Log out now" click={this.handleClickLogout} />
      </div>
    );
  }

  handleClickDashboard = () => {
    this.context.router.history.push('/');
  };

  handleClickLogout() {
    window.auth.logout();
  }
}

export default LogoutSection;
