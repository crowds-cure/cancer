import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar.js';
import Medal from './Medal.js';

import './ProgressSection.css';

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
        <div>
          <div className="numberCases">
            <div className="medalContainer">
              <Medal size="lg" type="NUM_CASES_NEWBIE" />
            </div>
            <div className="currentPoints">
              <span className="value">{this.props.current}</span>
              <span className="suffix">cases</span>
              <span className="plusPoints">
                +{increment.casesInCurrentSession}
              </span>
            </div>
          </div>
          <div className="progressBarContainer">
            <span className="progressLow">{low}</span>
            <span className="progressHigh">{high}</span>
            <ProgressBar
              min={low}
              max={high}
              current={this.props.current}
              increment={increment}
            />
          </div>
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
