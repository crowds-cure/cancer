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

    const badges = this.getAchievementsBadges(recentAchievements);

    return (
      <div className="d-flex no-gutters badgesGroup" onClick={this.toggleModal}>
        <div className="col-2">{badges[2]}</div>
        <div className="col-2">{badges[1]}</div>
        <div className="col-4">{badges[0]}</div>
        <div className="col-4 moreBadges">+{badges.length - 3}</div>
        <div className="col-4 viewAll">
          <span>
            View
            <br />
            all
          </span>
        </div>
      </div>
    );
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

    const mostRecentAchievementBadges = this.getMostRecentAchievements(5);
    const allAchievementBadges = this.getAchievementsBadges(achievements);

    return (
      <InfoBox className="AchievementSection" headerText="Badges">
        {mostRecentAchievementBadges}

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
      </InfoBox>
    );
  }
}

export default AchievementSection;
