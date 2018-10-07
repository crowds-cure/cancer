import { Component } from 'react';
import React from 'react';

class AutoLogoutCountdown extends Component {
  render() {
    const timeLeft = 29;

    return (
      <>
        <h1>
          Auto logout in <p className="timer">{timeLeft}</p> seconds
        </h1>
      </>
    );
  }
}

export default AutoLogoutCountdown;
