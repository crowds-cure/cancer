import { Component } from 'react';
import React from 'react';
import './AutoLogoutCountdown.css';

class AutoLogoutCountdown extends Component {
  render() {
    const timeLeft = 29;

    return (
      <div className="AutoLogoutCountdown">
        <span>Auto logout in </span>
        <span className="timer">{timeLeft}</span>
        <span>seconds</span>
      </div>
    );
  }
}

export default AutoLogoutCountdown;
