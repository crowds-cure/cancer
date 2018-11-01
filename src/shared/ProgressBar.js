import { Component } from 'react';
import React from 'react';
import './ProgressBar.css';
import PropTypes from 'prop-types';

class ProgressBar extends Component {
  render() {
    return (
      <progress
        className="ProgressBar"
        min={this.props.min}
        max={this.props.max}
        value={this.props.value}
      />
    );
  }
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  increment: PropTypes.object
};

export default ProgressBar;
