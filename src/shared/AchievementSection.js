import { Component } from 'react';
import React from 'react';
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip';
import AchievementBadge from './AchievementBadge.js';
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
