import { Component } from 'react';
import React from 'react';
import ProgressBar from './ProgressBar.js';
import PropTypes from 'prop-types';
import RankBadge from './RankBadge.js';
import { getBadgeByNumberOfCases } from '../badges.js';
import './ActivityProgressSection.css';
import Modal from 'react-modal';
import { achievements } from '../achievements';
import { BADGE_TYPES } from '../badges.js';

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

class ActivityProgressSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      achievements,
      showRanksModal: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(e) {
    e.preventDefault();
    this.setState({ showRanksModal: !this.state.showRanksModal });
  }

  getAllRankBadges(current) {
    const badges = Object.keys(BADGE_TYPES).map(type => {
      const badge = BADGE_TYPES[type];

      let className = 'rankBadge';

      if (current < badge.min) {
        className += ' not-received';
      }

      return (
        <div className={className} title={badge.name}>
          <img src={badge.img} alt={badge.name} />
          <h4 className="badgeName">{badge.name}</h4>
        </div>
      );
    });

    return badges;
  }

  render() {
    const current =
      this.props.current === undefined ? '---' : this.props.current;

    const rank = getBadgeByNumberOfCases(this.props.current);

    const allRankBadges = this.getAllRankBadges(this.props.current);

    return (
      <div className="ActivityProgressSection">
        <div className="title">
          <span>Rank: </span>
          <span className="rank">{rank.name}</span>
        </div>
        <div className="rankBadgeContainer">
          <RankBadge
            size="md"
            name={rank.name}
            img={rank.img}
            type={rank.type}
            onClick={this.toggleModal}
          />
        </div>
        <div className="progressBarContainer">
          {this.props.current === undefined ? (
            ''
          ) : (
            <ProgressBar
              min={rank.min}
              max={rank.max}
              value={this.props.current}
            />
          )}
        </div>
        <div className="currentPoints">
          <div className="value">{current}</div>
          <div className="suffix">measured</div>
        </div>

        <Modal
          isOpen={this.state.showRanksModal}
          contentLabel="All Ranks"
          onRequestClose={this.toggleModal}
          styles={modalDialogStyles}
          className="Modal"
          overlayClassName="Overlay"
          closeTimeoutMS={200}
        >
          <h1>Ranks</h1>
          <div className="row">{allRankBadges}</div>
          <span className="modal-close" onClick={this.toggleModal}>
            Close
          </span>
        </Modal>
      </div>
    );
  }
}

ActivityProgressSection.propTypes = {
  current: PropTypes.number
};

export default ActivityProgressSection;
