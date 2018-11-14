import { Component } from 'react';
import React from 'react';
import AchievementBadge from './AchievementBadge.js';
import { achievements } from '../achievements.js';
import './AchievementSection.css';

class AchievementSection extends Component {
  render() {
    const items = Object.keys(achievements).map(id => (
      <AchievementBadge id={id} img={achievements[id].img} />
    ));

    return (
      <div className="AchievementSection">
        <div className="title">Achievements</div>
        <div className="row">{items}</div>
      </div>
    );
  }
}

export default AchievementSection;
