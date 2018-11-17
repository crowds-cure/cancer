import { Component } from 'react';
import React from 'react';
import { BADGE_TYPES } from '../badges.js';
import './RankBadge.css';

class RankBadge extends Component {
  render() {
    const rankImg = BADGE_TYPES[this.props.type].img;
    return (
      <div className="rankBadge" title={this.props.type}>
        <img src={rankImg} alt="Rank Badge" />
      </div>
    );
  }
}

export default RankBadge;
