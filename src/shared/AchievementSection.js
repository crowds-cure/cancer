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
      achievements.day10Measurements.completed =
        achievementStatus.maxMeasurementsInDay >= 10;
      achievements.day25Measurements.completed =
        achievementStatus.maxMeasurementsInDay >= 25;
      achievements.day50Measurements.completed =
        achievementStatus.maxMeasurementsInDay >= 50;
      achievements.day75Measurements.completed =
        achievementStatus.maxMeasurementsInDay >= 75;
      achievements.day100Measurements.completed =
        achievementStatus.maxMeasurementsInDay >= 100;
      achievements.day200Measurements.completed =
        achievementStatus.maxMeasurementsInDay >= 200;

      // Productivity Badges - Week
      achievements.weekMeasurements50.completed =
        achievementStatus.maxMeasurementsInWeek >= 50;
      achievements.weekMeasurements100.completed =
        achievementStatus.maxMeasurementsInWeek >= 100;
      achievements.weekMeasurements250.completed =
        achievementStatus.maxMeasurementsInWeek >= 250;
      achievements.weekMeasurements500.completed =
        achievementStatus.maxMeasurementsInWeek >= 500;

      // Productivity Badges - Session
      achievements.sessionMeasurements25.completed =
        achievementStatus.maxMeasurementsInSession >= 25;
      achievements.sessionMeasurements50.completed =
        achievementStatus.maxMeasurementsInSession >= 50;
      achievements.sessionMeasurements75.completed =
        achievementStatus.maxMeasurementsInSession >= 75;
      achievements.sessionMeasurements100.completed =
        achievementStatus.maxMeasurementsInSession >= 100;
      achievements.sessionMeasurements200.completed =
        achievementStatus.maxMeasurementsInSession >= 200;

      // Persistence Badges - Session
      achievements.timeSession15.completed =
        achievementStatus.maxSessionDurationInMin >= 15;
      achievements.timeSession30.completed =
        achievementStatus.maxSessionDurationInMin >= 30;
      achievements.timeSession60.completed =
        achievementStatus.maxSessionDurationInMin >= 60;
      achievements.timeSession90.completed =
        achievementStatus.maxSessionDurationInMin >= 90;

      this.setState({
        achievements
      });
    });
  }

  render() {
    const { achievements } = this.state;

    // Collection Badge
    achievements.collectionAllCases.completed =
      this.props.totalCompleteCollection > 0;

    const items = Object.keys(achievements).map(id => {
      const achievementImg = achievements[id].completed
        ? achievements[id].imgActive
        : achievements[id].imgInactive;
      const { description } = achievements[id];
      return (
        <AchievementBadge
          key={id}
          img={achievementImg}
          description={description}
        />
      );
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
