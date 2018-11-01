import { Component } from 'react';
import React from 'react';
import ProgressBar from './ProgressBar.js';
import PropTypes from 'prop-types';
import Medal from './Medal.js';

import './ActivityProgressSection.css';

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

    const current =
      this.props.current === undefined ? '---' : this.props.current;

    return (
      <div className="ActivityProgressSection">
        <div className="title">Your Activity</div>
        <div className="medalContainer">
          <Medal size="md" type="NUM_CASES_NEWBIE" />
        </div>
        <div className="progressBarContainer">
          <ProgressBar min={low} max={high} value={this.props.current} />
        </div>
        <div className="currentPoints">
          <div className="value">{current}</div>
          <div className="suffix">measured</div>
        </div>
      </div>
    );
  }
}

ProgressSection.propTypes = {
  current: PropTypes.number.isRequired,
  casesInCurrentSession: PropTypes.number
};

export default ProgressSection;
