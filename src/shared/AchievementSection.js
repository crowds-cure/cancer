import { Component } from 'react';
import React from 'react';
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip';
import AchievementBadge from './AchievementBadge.js';
import AchievementDetails from './AchievementDetails.js';
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

  getSingleBadge(badge) {
    return (
      <div className="singleBadge" onClick={this.toggleModal}>
        {badge}
      </div>
    );
  }

  renderSingleBadges(badges) {
    const viewAll = (
      <div
        className="col-4 col-xs-16 viewAll"
        onClick={this.toggleModal}
      >
        <span>View <br className="d-xs-none" />all</span>
        <span className="d-none d-xs-inline"> badges</span>
      </div>
    );

    const colValue = 12 / badges.length;
    const badgeElements = [];
    badges.forEach(badge => {
      badgeElements.push(
        <div className={`col-${colValue} col-xs`}>
          {this.getSingleBadge(badge)}
        </div>
      );
    });

    return (
      <div class="badgesSingle col-16 d-flex flex-wrap">
        {badgeElements}
        {viewAll}
      </div>
    );
  }

  getMostRecentAchievements() {
    const { achievements } = this.state;

    const sortedAchievementKeys = Object.keys(achievements).sort(
      (a, b) =>
        (achievements[b].completed || false) -
        (achievements[a].completed || false)
    );
    const achievementKeys = sortedAchievementKeys.filter(key => {
      return achievements[key].completed;
    });

    const recentAchievements = {};
    achievementKeys.forEach(achievementKey => {
      recentAchievements[achievementKey] = achievements[achievementKey];
    });

    const badges = this.getAchievementsBadges(recentAchievements);

    return (
      <div className={`d-flex no-gutters badgesContent badges-${badges.length}`}>
        {badges.length > 4 ? (
          <div className="col-md d-none d-md-block">
            {this.getSingleBadge(badges[4])}
          </div>
        ) : ''}
        {badges.length > 3 ? (
          <>
            <div className="col-xs-5 col-md d-none d-xs-block">
              {this.getSingleBadge(badges[3])}
            </div>
            <div className="badgesWrapper col-16 col-xs-11 col-md">
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
                {badges.length > 4 ? (
                  <div className="col-xs-5 d-none d-md-none d-xs-block">
                    <div className="moreBadges">+{badges.length - 4}</div>
                  </div>
                ) : ''}
                {badges.length > 5 ? (
                  <div className="col-md-5 d-none d-md-block">
                    <div className="moreBadges">+{badges.length - 5}</div>
                  </div>
                ) : ''}
                <div className="col-3 d-xs-none viewAll">
                  <span>
                    View
                    <br />
                    all
                  </span>
                </div>
                <div className="col-xs-16 d-none d-xs-block viewAll">
                  View all badges
                </div>
              </div>
            </div>
          </>
        ) : this.renderSingleBadges(badges)}
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
    const achievement = achievements[id];
    return <AchievementDetails key={id} id={id} achievement={achievement} />;
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

    const mostRecentAchievements = this.getMostRecentAchievements();
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
