import { Component } from 'react';
import React from 'react';
import './ProgressBar.css';
import PropTypes from 'prop-types';

class ProgressBar extends Component {
  constructor(props) {
    super(props);

    if (this.props.value === undefined) {
      this.props.value = this.props.min;
    }

    this.state = {
      value: this.props.value - this.props.min,
      max: this.props.max - this.props.min,
      lastMax: this.props.max
    };

    this.progressBar = React.createRef();
    this.progressBarGlow = React.createRef();
  }

  render() {
    return (
      <div className="ProgressBarWrapper">
        {this.props.startNumber === undefined ? (
          ''
        ) : (
          <div className="startNumber">{this.props.startNumber}</div>
        )}
        <progress
          className="ProgressBar"
          max={this.state.max}
          value={this.state.value}
          ref={this.progressBar}
        />
        <progress
          className="ProgressBar ProgressBarGlow"
          max={this.state.max}
          value={this.state.value}
          ref={this.progressBarGlow}
        />
        {this.props.endNumber === undefined ? (
          ''
        ) : (
          <div className="endNumber">{this.props.endNumber}</div>
        )}
      </div>
    );
  }

  componentDidMount = () => {
    const delay = 300;
    const increment = this.props.increment;
    if (increment) {
      setTimeout(() => {
        this.setState({
          value: this.state.value + increment
        });
      }, delay);
    }
  };

  componentDidUpdate = previousProps => {
    let previousValue;

    if (this.state.lastMax !== this.props.max) {
      previousValue = 0;
    } else if (previousProps.value !== this.props.value) {
      previousValue = previousProps.value;
    }

    if (previousValue !== undefined) {
      this.progressBar.current.classList.add('notransition');
      this.progressBarGlow.current.classList.add('notransition');
      this.progressBar.current.value = previousValue;
      this.progressBarGlow.current.value = previousValue;
      setTimeout(() => {
        this.progressBar.current.classList.remove('notransition');
        this.progressBarGlow.current.classList.remove('notransition');
        this.setState({
          value: this.props.value - this.props.min,
          max: this.props.max - this.props.min,
          lastMax: this.props.max
        });
      }, 10);
    }
  };
}

ProgressBar.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  increment: PropTypes.number
};

export default ProgressBar;
