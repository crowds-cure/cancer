import { Component } from 'react';
import React from 'react';
import ProgressBar from './ProgressBar.js';
import PropTypes from 'prop-types';
import RankBadge from './RankBadge.js';
import { getBadgeByNumberOfCases } from '../badges.js';
import './ActivityProgressSection.css';

class ActivityProgressSection extends Component {
  render() {
    const current =
      this.props.current === undefined ? '---' : this.props.current;

    const rank = getBadgeByNumberOfCases(this.props.current);

    return (
      <div className="ActivityProgressSection">
        <div className="title">
          <span>Rank: </span>
          <span className="rank">{rank.name}</span>
        </div>
        <div className="rankBadgeContainer">
          <RankBadge
            size="md"
            name={rank.name}
            img={rank.img}
            type={rank.type}
          />
        </div>
        <div className="progressBarContainer">
          {this.props.current === undefined ? (
            ''
          ) : (
            <ProgressBar
              min={rank.min}
              max={rank.max}
              value={this.props.current}
            />
          )}
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
  current: PropTypes.number
};

export default ActivityProgressSection;
