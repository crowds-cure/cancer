import { Component } from 'react';
import React from 'react';
import './ProgressBar.css';
import PropTypes from 'prop-types';

class ProgressBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value - this.props.min,
      max: this.props.max - this.props.min
    };

    const delay = 2000;

    const increment = this.props.increment;
    if (increment) {
      setTimeout(() => {
        this.setState({
          value: this.state.value + increment
        });
      }, delay);
    }
  }

  render() {
    return (
      <progress
        className="ProgressBar"
        max={this.state.max}
        value={this.state.value}
      />
    );
  }
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  increment: PropTypes.number
};

export default ProgressBar;
