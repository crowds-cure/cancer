import { Component } from 'react';
import React from 'react';
import ProgressBar from './ProgressBar.js';
import PropTypes from 'prop-types';
import Medal from './Medal.js';
import { getBadgeByNumberOfCases } from '../badges.js';
import './ActivityProgressSection.css';

class ActivityProgressSection extends Component {
  render() {
    const current =
      this.props.current === undefined ? '---' : this.props.current;

    let rank;
    if (this.props.current !== undefined) {
      rank = getBadgeByNumberOfCases(this.props.current);
      console.warn(rank);
    }

    const rankName = rank ? rank.name : '';
    const low = rank ? rank.min : 0;
    const high = rank ? rank.max : 10;
    const rankType = rank ? rank.type : 'NUM_CASES_NOVICE';

    return (
      <div className="ActivityProgressSection">
        <div className="title">Your Activity</div>
        <div className="medalContainer" title={rankName}>
          <Medal size="md" type={rankType} />
          <span className="rank">{rankName}</span>
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

ActivityProgressSection.propTypes = {
  current: PropTypes.number.isRequired
};

export default ActivityProgressSection;
