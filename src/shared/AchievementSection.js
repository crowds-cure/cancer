import { Component } from 'react';
import React from 'react';
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip';
import AchievementBadge from './AchievementBadge.js';
import InfoBox from './InfoBox.js';
import { achievements } from '../achievements.js';
import './AchievementSection.css';
import '../shared/Modal.css';
import getAchievementsForUser from './getAchievementsForUser';

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

    getAchievementsForUser().then(achievementKeys => {
      achievementKeys.forEach(achievementKey => {
        achievements[achievementKey].completed = true;
      });
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

    // TODO: [layout] Remove
    Object.keys(recentAchievements).forEach(id => {
      achievements[id].completed = true;
    });

    const badges = this.getAchievementsBadges(recentAchievements);

    return (
      <div className="d-flex no-gutters badgesContent">
        <div className="col-md d-none d-md-block">
          <div className="singleBadge" onClick={this.toggleModal}>
            {badges[4]}
          </div>
        </div>
        <div className="col-xs-5 col-md d-none d-xs-block">
          <div className="singleBadge" onClick={this.toggleModal}>
            {badges[3]}
          </div>
        </div>
        <div className="col-16 col-xs-11 col-md">
          <div
            className="row no-gutters badgesGroup"
            onClick={this.toggleModal}
          >
            <div className="col-2 col-xs-3">{badges[2]}</div>
            <div className="col-2 col-xs-3">{badges[1]}</div>
            <div className="col-4 col-xs-5">{badges[0]}</div>
            <div className="col-5 d-xs-none">
              <div className="moreBadges">+{badges.length - 3}</div>
            </div>
            <div className="col-xs-5 d-none d-md-none d-xs-block">
              <div className="moreBadges">+{badges.length - 4}</div>
            </div>
            <div className="col-md-5 d-none d-md-block">
              <div className="moreBadges">+{badges.length - 5}</div>
            </div>
            <div className="col-3 d-xs-none viewAll">
              <span>
                View
                <br />
                all
              </span>
            </div>
            <div className="col-xs-16 d-none d-xs-block viewAll">
              View earned badges
            </div>
          </div>
        </div>
      </div>
    );
  }

  getCompactBadge(id) {
    const { achievements } = this.state;
    const { description, completed, img } = achievements[id];
    const className = completed ? 'active' : 'inactive';
    return (
      <AchievementBadge
        key={id}
        className={className}
        img={img}
        description={description}
      />
    );
  }

  getDetailedBadge(id) {
    const { achievements } = this.state;
    const compactBadgeElement = this.getCompactBadge(id);
    const { description, completed } = achievements[id];
    const className = completed ? 'active' : 'inactive';

    // TODO: [layout] Define title, dateEarned, currentValue and maxValue
    const title = 'Badge title';
    const dateEarned = 'Earned 9 Aug, 2018 - 7:22 PM';
    let hasProgress = false;
    let currentValue;
    let maxValue;

    if (id === 'timeSessionWeek90m') {
      hasProgress = true;
      currentValue = 68;
      maxValue = 90;
    } else if (id === 'day50Measurements') {
      hasProgress = true;
      currentValue = 16;
      maxValue = 50;
    }

    const progressPercent = (currentValue / maxValue) * 100;
    const currentClass = progressPercent <= 50 ? 'after' : '';
    const currentStyle = {
      width: `${progressPercent}%`
    };

    return (
      <div key={id} className={`AchievementDetails ${className}`}>
        {compactBadgeElement}
        <div className="info">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
          {hasProgress ? (
            <div className="progress">
              <div className={`current ${currentClass}`} style={currentStyle}>
                <span className="value">
                  {currentValue}/{maxValue}
                </span>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="date">{dateEarned}</div>
      </div>
    );
  }

  getAchievementsBadges(achievementsList, isDetailed = false) {
    return Object.keys(achievementsList).map(id => {
      return isDetailed ? this.getDetailedBadge(id) : this.getCompactBadge(id);
    });
  }

  toggleModal(e) {
    e.preventDefault();
    this.setState({ showAchievementsModal: !this.state.showAchievementsModal });
    ReactTooltip.hide();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const { achievements } = this.state;

    const mostRecentAchievements = this.getMostRecentAchievements(6);
    const allAchievements = this.getAchievementsBadges(achievements, true);

    return (
      <InfoBox className="AchievementSection" headerText="Badges">
        {mostRecentAchievements}

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
          <h1>All Achievements</h1>
          <div className="Achievements">{allAchievements}</div>
          <span className="modal-close" onClick={this.toggleModal}>
            Close
          </span>
        </Modal>
      </InfoBox>
    );
  }
}

export default AchievementSection;
