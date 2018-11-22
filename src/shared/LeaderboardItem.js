import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import './LeaderboardItem.css';

class LeaderboardItem extends Component {
  render() {
    return (
      <div className="LeaderboardItem">
        <div className="score">
          {this.props.score && this.props.score.toLocaleString()}
        </div>
        <div className="rank">{this.props.rank}</div>
        <div className="name" title={this.props.name}>
          {this.props.name}
        </div>
      </div>
    );
  }
}

LeaderboardItem.propTypes = {
  score: PropTypes.number,
  rank: PropTypes.number,
  name: PropTypes.string
};

export default LeaderboardItem;
