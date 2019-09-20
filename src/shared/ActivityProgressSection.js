import { Component } from 'react';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ProgressBar from './ProgressBar.js';
import PropTypes from 'prop-types';
import RankBadge from './RankBadge.js';
import InfoBox from './InfoBox.js';
import { getBadgeByNumberOfCases } from '../badges.js';
import './ActivityProgressSection.css';
import Modal from 'react-modal';
import { achievements } from '../achievements';
import { BADGE_TYPES } from '../badges.js';
import animate from './animate.js';

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
      showRanksModal: false,
      measurementsCount: props.current || 0
    };

    this.measurementsCountRef = React.createRef();

    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    const element = this.measurementsCountRef.current;
    element.innerText = this.state.measurementsCount;
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();

    if (this.state.measurementsCount !== this.props.current) {
      const oldValue = this.state.measurementsCount || 0;

      animate(3000, progress => {
        const diff = this.props.current - oldValue;
        const result = oldValue + diff * progress;
        const newValue = Math.floor(result);

        const element = this.measurementsCountRef.current;
        const currentValue = parseInt(element.innerText, 10);

        if (currentValue === this.props.current) {
          this.setState({ measurementsCount: this.props.current });
        } else if (newValue !== currentValue) {
          element.innerText = newValue;
        }
      });
    }
  }

  toggleModal(e) {
    e.preventDefault();
    this.setState({ showRanksModal: !this.state.showRanksModal });
    ReactTooltip.hide();
  }

  getAllRankBadges(current) {
    const badges = Object.keys(BADGE_TYPES).map(type => {
      const badge = BADGE_TYPES[type];

      let className = 'rankBadge';

      if (current < badge.min) {
        className += ' not-received';
      }

      return (
        <div key={badge.name} className={className}>
          <img src={badge.img} alt={badge.name} data-tip={badge.description} />
          <h4 className="badgeName">{badge.name}</h4>
        </div>
      );
    });

    return badges;
  }

  render() {
    const current = this.props.current === undefined ? 0 : this.props.current;

    const rank = getBadgeByNumberOfCases(this.props.current);

    const allRankBadges = this.getAllRankBadges(this.props.current);

    return (
      <InfoBox className="ActivityProgressSection" headerText="Score and rank">
        <div className="row">
          <div className="col-12">
            <RankBadge
              size="md"
              name={rank.name}
              img={rank.img}
              type={rank.type}
              description={rank.name}
              onClick={this.toggleModal}
            />
            <div className="measurementsCount" ref={this.measurementsCountRef}>
              {this.state.measurementsCount}
            </div>
          </div>
          <div className="d-none d-md-block col-4 leaderboardRank">
            <div className="position">18</div>
            <div className="description">
              Leaderboard
              <br />
              Rank
            </div>
          </div>
          <div className="col-16 progressBarContainer">
            <ProgressBar
              min={rank.min}
              max={rank.max}
              value={current}
              endNumber={rank.max}
            />
          </div>
        </div>
        <Modal
          isOpen={this.state.showRanksModal}
          contentLabel="All Ranks"
          onRequestClose={this.toggleModal}
          styles={modalDialogStyles}
          className="Modal"
          overlayClassName="Overlay"
          closeTimeoutMS={200}
          onAfterOpen={ReactTooltip.rebuild}
        >
          <h1>Ranks</h1>
          <div className="row">{allRankBadges}</div>
          <span className="modal-close" onClick={this.toggleModal}>
            Close
          </span>
        </Modal>
      </InfoBox>
    );
  }
}

ActivityProgressSection.propTypes = {
  current: PropTypes.number
};

export default ActivityProgressSection;
