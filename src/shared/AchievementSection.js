import { Component } from 'react';
import React from 'react';
import AchievementBadge from './AchievementBadge.js';

class AchievementSection extends Component {
  render() {
    const userBadges = [
      {
        type: 'NUM_CASES_ROOKIE',
        dateReached: new Date()
      }
    ];

    const items = userBadges.map(item => (
      <AchievementBadge key={item.type} type={item.type} />
    ));

    return <div className="AchievementSection">{items}</div>;
  }
}

export default AchievementSection;
