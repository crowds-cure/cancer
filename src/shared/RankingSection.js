import { Component } from 'react';
import React from 'react';
import RankingItem from './RankingItem.js';

class RankingSection extends Component {
  render() {
    const userBadges = [
      {
        type: 'NUM_CASES_ROOKIE',
        dateReached: new Date()
      }
    ];

    const items = userBadges.map((item, index) => (
      <li key={index}>
        <RankingItem type={item.type} />
      </li>
    ));

    return (
      <div className="RankingSection">
        <h1>{this.props.name}</h1>
        <ul>{items}</ul>
      </div>
    );
  }
}

export default RankingSection;
