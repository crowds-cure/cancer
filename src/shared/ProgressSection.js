import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar.js';
import Medal from './Medal.js';

import './ProgressSection.css';
import { getBadgeByNumberOfCases } from '../badges';

class ProgressSection extends Component {
  render() {
    const current =
      this.props.current === undefined ? '---' : this.props.current;

    let rank;
    if (this.props.current !== undefined) {
      rank = getBadgeByNumberOfCases(this.props.current);
    }

    const rankName = rank ? rank.name : '';
    const low = rank ? rank.min : 0;
    const high = rank ? rank.max : 10;
    const rankType = rank ? rank.type : 'NUM_CASES_NOVICE';

    const increment = {
      casesInCurrentSession: this.props.casesInCurrentSession
    };

    return (
      <div className="ProgressSection">
        <div>
          <div className="numberCases">
            <div className="medalContainer" title={rankName}>
              <Medal size="lg" type={rankType} />
            </div>
            <div className="currentPoints">
              <span className="value">{current}</span>
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
              value={this.props.current}
              increment={increment}
            />
          </div>
        </div>
      </div>
    );
  }
}

ProgressSection.propTypes = {
  current: PropTypes.number,
  casesInCurrentSession: PropTypes.number
};

export default ProgressSection;
