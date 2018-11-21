import { Component } from 'react';
import React from 'react';
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip';
import AchievementBadge from './AchievementBadge.js';
import { achievements } from '../achievements.js';
import getAchievementStatusForUser from './getAchievementStatusForUser.js';
import './AchievementSection.css';
import '../shared/Modal.css';

const modalDialogStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class AchievementSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      achievements,
      showAchievementsModal: false
    };

    this.toggleModal = this.toggleModal.bind(this);

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

      // Persistence Badges - Week
      achievements.timeSessionWeek90m.completed =
        achievementStatus.totalSessionDurationInMinInWeek >= 90;
      achievements.timeSessionWeek3h.completed =
        achievementStatus.totalSessionDurationInMinInWeek >= 180;
      achievements.timeSessionWeek6h.completed =
        achievementStatus.totalSessionDurationInMinInWeek >= 360;
      achievements.timeSessionWeek9h.completed =
        achievementStatus.totalSessionDurationInMinInWeek >= 540;

      // Individual Leader Badge - Day
      achievements.rsna18Day1.completed =
        achievementStatus.topIndivNumberInRSNA18Day === 1;
      achievements.rsna18DayTop10.completed =
        achievementStatus.topIndivNumberInRSNA18Day > 0 &&
        achievementStatus.topIndivNumberInRSNA18Day < 11;

      // Individual Leader Badge - Week
      achievements.rsna18Week1.completed =
        achievementStatus.topIndivNumberInRSNA18Week === 1;
      achievements.rsna18WeekTop10.completed =
        achievementStatus.topIndivNumberInRSNA18Week > 0 &&
        achievementStatus.topIndivNumberInRSNA18Week < 11;

      // Group Badge
      achievements.rsna18Group1.completed =
        achievementStatus.topTeamNumberInRSNA18Week === 1;
      achievements.rsna18Group2.completed =
        achievementStatus.topTeamNumberInRSNA18Week === 2;
      achievements.rsna18Group3.completed =
        achievementStatus.topTeamNumberInRSNA18Week === 3;

      this.setState({
        achievements
      });
    });
  }

  getMostRecentAchievements(limit) {
    const { achievements } = this.state;

    const sortedAchievementKeys = Object.keys(achievements).sort(
      (a, b) =>
        (achievements[b].completed || false) -
        (achievements[a].completed || false)
    );
    const slicedAchievementKeys = sortedAchievementKeys.slice(0, limit);

    const recentAchievements = {};
    slicedAchievementKeys.forEach(achievementKey => {
      recentAchievements[achievementKey] = achievements[achievementKey];
    });

    return recentAchievements;
  }

  getAchievementsBadges(achievementsList) {
    const { achievements } = this.state;

    return Object.keys(achievementsList).map(id => {
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
  }

  toggleModal(e) {
    e.preventDefault();
    this.setState({ showAchievementsModal: !this.state.showAchievementsModal });
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const { achievements } = this.state;

    // Collection Badge
    achievements.collectionAllCases.completed =
      this.props.totalCompleteCollection > 0;

    const mostRecentAchievements = this.getMostRecentAchievements(6);

    const allAchievementBadges = this.getAchievementsBadges(achievements);
    const mostRecentAchievementBadges = this.getAchievementsBadges(
      mostRecentAchievements
    );

    return (
      <div className="AchievementSection">
        <div className="header">
          <div className="title">Achievements</div>
          <button className="view-all" onClick={this.toggleModal}>
            view all
          </button>
        </div>
        <div className="row">{mostRecentAchievementBadges}</div>

        <Modal
          isOpen={this.state.showAchievementsModal}
          contentLabel="All Achievements"
          onRequestClose={this.toggleModal}
          styles={modalDialogStyles}
          className="Modal"
          overlayClassName="Overlay"
          closeTimeoutMS={200}
          onAfterOpen={ReactTooltip.rebuild}
        >
          <h1>Achievements</h1>
          <div className="row">{allAchievementBadges}</div>
          <span className="modal-close" onClick={this.toggleModal}>
            Close
          </span>
        </Modal>

        <ReactTooltip className="AchievementSectionTooltip" effect="solid" />
      </div>
    );
  }
}

export default AchievementSection;
