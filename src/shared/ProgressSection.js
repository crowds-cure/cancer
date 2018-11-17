import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar.js';
import RankBadge from './RankBadge.js';

import './ProgressSection.css';
import { getBadgeByNumberOfCases } from '../badges';

class ProgressSection extends Component {
  render() {
    const current =
      this.props.current === undefined ? '---' : this.props.current;

    const rank = getBadgeByNumberOfCases(this.props.current);

    const increment = {
      measurementsInCurrentSession: this.props.measurementsInCurrentSession
    };

    return (
      <div className="ProgressSection">
        <div>
          <div className="numberCases">
            <div className="rankBadgeContainer">
              <RankBadge name={rank.name} img={rank.img} type={rank.type} />
            </div>
            <div className="currentPoints">
              <span className="value">{current}</span>
              <span className="suffix">measured</span>
              <span className="plusPoints">
                +{increment.measurementsInCurrentSession}
              </span>
            </div>
          </div>
          <div className="progressBarContainer">
            <span className="progressLow">{rank.min}</span>
            <span className="progressHigh">{rank.max}</span>
            {this.props.current === undefined ? (
              ''
            ) : (
              <ProgressBar
                min={rank.min}
                max={rank.max}
                value={this.props.current}
                increment={increment.measurementsInCurrentSession}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

ProgressSection.propTypes = {
  current: PropTypes.number,
  measurementsInCurrentSession: PropTypes.number
};

export default ProgressSection;
