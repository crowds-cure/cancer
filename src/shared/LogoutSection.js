import { Component } from 'react';
import React from 'react';
import AutoLogoutCountdown from './AutoLogoutCountdown.js';
import Button from './Button.js';

class LogoutSection extends Component {
  render() {
    return (
      <div className="LogoutSection">
        <AutoLogoutCountdown />
        <Button text="Dashboard" />
        <Button text="Log out now" />
      </div>
    );
  }
}

export default LogoutSection;
