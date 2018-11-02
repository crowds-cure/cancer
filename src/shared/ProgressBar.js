import { Component } from 'react';
import React from 'react';
import './ProgressBar.css';
import PropTypes from 'prop-types';

class ProgressBar extends Component {
  render() {
    const max = this.props.max - this.props.min;
    const value = this.props.value - this.props.min;

    return <progress className="ProgressBar" max={max} value={value} />;
  }
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  increment: PropTypes.object
};

export default ProgressBar;
