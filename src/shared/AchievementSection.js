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
      <div className="d-flex no-gutters badgesContent">
        <div className="col-md d-none d-md-block">
          <div className="singleBadge" onClick={this.toggleModal}>
            {badges[4]}
          </div>
        </div>
        <div className="col-sm-5 col-md d-none d-sm-block">
          <div className="singleBadge" onClick={this.toggleModal}>
            {badges[3]}
          </div>
        </div>
        <div className="col-16 col-sm-11 col-md">
          <div
            className="row no-gutters badgesGroup"
            onClick={this.toggleModal}
          >
            <div className="col-2 col-sm-3">{badges[2]}</div>
            <div className="col-2 col-sm-3">{badges[1]}</div>
            <div className="col-4 col-sm-5">{badges[0]}</div>
            <div className="col-5 d-sm-none">
              <div className="moreBadges">+{badges.length - 3}</div>
            </div>
            <div className="col-sm-5 d-none d-md-none d-sm-block">
              <div className="moreBadges">+{badges.length - 4}</div>
            </div>
            <div className="col-md-5 d-none d-md-block">
              <div className="moreBadges">+{badges.length - 5}</div>
            </div>
            <div className="col-3 d-sm-none viewAll">
              <span>
                View
                <br />
                all
              </span>
            </div>
            <div className="col-sm-16 d-none d-sm-block viewAll">
              View earned badges
            </div>
          </div>
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
    ReactTooltip.hide();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const { achievements } = this.state;

    const mostRecentAchievementBadges = this.getMostRecentAchievements(6);
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
