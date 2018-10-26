import { Component } from 'react';
import React from 'react';
import AutoLogoutCountdown from './AutoLogoutCountdown.js';
import Button from './Button.js';

const style = {
  display: 'flex',
  justifyContent: 'center'
};

class LogoutSection extends Component {
  render() {
    return (
      <div className="LogoutSection" style={style}>
        <AutoLogoutCountdown />
        <Button label="Dashboard" />
        <Button label="Log out now" />
      </div>
    );
  }
}

export default LogoutSection;
