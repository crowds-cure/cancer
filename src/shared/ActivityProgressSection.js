import { Component } from 'react';
import React from 'react';
import ProgressBar from './ProgressBar.js';
import PropTypes from 'prop-types';
import Medal from './Medal.js';
import { getBadgeByNumberOfCases } from '../badges.js';
import './ActivityProgressSection.css';

class ActivityProgressSection extends Component {
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

    let rank;
    if (this.props.current !== undefined) {
      rank = getBadgeByNumberOfCases(this.props.current);
      console.warn(rank);
    }

    const rankName = rank ? rank.name : '';

    return (
      <div className="ActivityProgressSection">
        <div className="title">Your Activity</div>
        <div className="medalContainer">
          <Medal size="md" type={rankName} />
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
  current: PropTypes.number.isRequired,
  casesInCurrentSession: PropTypes.number
};

export default ActivityProgressSection;
