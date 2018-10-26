import { Component } from 'react';
import React from 'react';
import StatisticsCard from './StatisticsCard.js';
import './StatisticsSection.css';

class StatisticsSection extends Component {
  render() {
    const userBadges = [
      {
        type: 'NUM_CASES_ROOKIE',
        dateReached: new Date()
      },
      {
        type: 'NUM_CASES_ROOKIE2',
        dateReached: new Date()
      },
      {
        type: 'NUM_CASES_ROOKIE3',
        dateReached: new Date()
      },
      {
        type: 'NUM_CASES_ROOKIE4',
        dateReached: new Date()
      },
      {
        type: 'NUM_CASES_ROOKIE5',
        dateReached: new Date()
      }
    ];

    const items = userBadges.map(item => (
      <StatisticsCard key={item.type} type={item.type} />
    ));

    return (
      <div className="StatisticsSection">
        <span className="subTitle">Community stats</span>
        {items}
      </div>
    );
  }
}

export default StatisticsSection;
