import { Component } from 'react';
import React from 'react';
import ProgressBar from './ProgressBar.js';
import './ProgressSection.css';
import PropTypes from 'prop-types';

class ProgressSection extends Component {
  constructor(props) {
    super(props);

    this.getLowAndHigh = this.getLowAndHigh.bind(this);
  }

  getLowAndHigh() {
    return {
      low: Math.floor(this.props.current / 100) * 100,
      high: Math.ceil(this.props.current / 100) * 100
    };
  }

  render() {
    const { low, high } = this.getLowAndHigh();

    const increment = {
      casesInCurrentSession: this.props.casesInCurrentSession
    };

    return (
      <div className="ProgressSection">
        <span className="title">Your activity</span>
        <ProgressBar
          min={low}
          max={high}
          current={this.props.current}
          increment={increment}
        />
        <span className="value">{this.props.current}</span>
        <span className="suffix">cases</span>
      </div>
    );
  }
}

ProgressSection.propTypes = {
  current: PropTypes.number.isRequired,
  casesInCurrentSession: PropTypes.number
};

export default ProgressSection;
