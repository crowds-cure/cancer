import { Component } from 'react';
import React from 'react';
import './AutoLogoutCountdown.css';

class AutoLogoutCountdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeLeft: this.props.timeLeft
    };

    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.countDown, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let suffix = 'seconds';
    if (this.state.timeLeft === 1) {
      suffix = 'second';
    }

    return (
      <div className="AutoLogoutCountdown">
        {this.state.timeLeft ? (
          <>
            <span>Auto logout in </span>
            <span className="timer">{this.state.timeLeft}</span>
            <span>{suffix}</span>{' '}
          </>
        ) : (
          <span>Logging out now...</span>
        )}
      </div>
    );
  }

  countDown() {
    const { timeLeft } = this.state;
    const remaining = timeLeft - 1;
    if (timeLeft === 0) {
      window.auth.logout();
    } else {
      this.setState({
        timeLeft: remaining
      });
    }
  }
}

export default AutoLogoutCountdown;
