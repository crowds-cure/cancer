import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import './LeaderboardItem.css';

class LeaderboardItem extends Component {
  render() {
    const { name, principalName, score, rank, teamLabel } = this.props;
    const nameToDisplay = principalName || name;

    return (
      <div className="LeaderboardItem">
        <div className="rank">{rank}</div>
        <div className="score">{score && score.toLocaleString()}</div>
        <div className="name" title={nameToDisplay}>
          <span>{nameToDisplay}</span>
          {teamLabel ? (
            <span className="team" title={teamLabel}>
              <span>{teamLabel}</span>
            </span>
          ) : ''}
        </div>

      </div>
    );
  }
}

LeaderboardItem.propTypes = {
  score: PropTypes.number,
  rank: PropTypes.number,
  name: PropTypes.string,
  principalName: PropTypes.string
};

export default LeaderboardItem;
