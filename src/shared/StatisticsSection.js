import { Component } from 'react';
import React from 'react';
import StatisticsCard from './StatisticsCard.js';

class StatisticsSection extends Component {
  render() {
    const userBadges = [
      {
        type: 'NUM_CASES_ROOKIE',
        dateReached: new Date()
      }
    ];

    const items = userBadges.map(item => (
      <StatisticsCard key={item.type} type={item.type} />
    ));

    return <div className="StatisticsSection">{items}</div>;
  }
}

export default StatisticsSection;
