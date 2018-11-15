import { Component } from 'react';
import React from 'react';
import AchievementBadge from './AchievementBadge.js';
import './AchievementSection.css';
import { achievements } from '../achievements.js';
import getAchievementStatusForUser from './getAchievementStatusForUser.js';

class AchievementSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      achievements
    };

    getAchievementStatusForUser().then(achievementStatus => {
      // Productivity Badges - Day
      achievements.ProductivityDay10.completed =
        achievementStatus.maxMeasurementsInDay >= 10;
      achievements.ProductivityDay25.completed =
        achievementStatus.maxMeasurementsInDay >= 25;
      achievements.ProductivityDay50.completed =
        achievementStatus.maxMeasurementsInDay >= 50;
      achievements.ProductivityDay75.completed =
        achievementStatus.maxMeasurementsInDay >= 75;
      achievements.ProductivityDay100.completed =
        achievementStatus.maxMeasurementsInDay >= 100;
      achievements.ProductivityDay200.completed =
        achievementStatus.maxMeasurementsInDay >= 200;
      // Productivity Badges - Week
      achievements.ProductivityWeek50.completed =
        achievementStatus.maxMeasurementsInWeek >= 50;
      achievements.ProductivityWeek100.completed =
        achievementStatus.maxMeasurementsInWeek >= 100;
      achievements.ProductivityWeek250.completed =
        achievementStatus.maxMeasurementsInWeek >= 250;
      achievements.ProductivityWeek500.completed =
        achievementStatus.maxMeasurementsInWeek >= 500;
    });
  }

  render() {
    const { achievements } = this.state;

    const items = Object.keys(achievements).map(id => {
      const achievementImg = achievements[id].completed
        ? achievements[id].imgActive
        : achievements[id].imgInactive;
      return <AchievementBadge key={id} img={achievementImg} />;
    });

    return (
      <div className="AchievementSection">
        <div className="title">Achievements</div>
        <div className="row">{items}</div>
      </div>
    );
  }
}

export default AchievementSection;
