import { Component } from 'react';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar.js';
import RankBadge from './RankBadge.js';

import './ProgressSection.css';
import { BADGE_TYPES, getBadgeByNumberOfCases } from '../badges';
import animateNumber from './animateNumber.js';

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

class ProgressSection extends Component {
  constructor(props) {
    super(props);

    this.preventAnimations = false;

    this.incrementRef = React.createRef();
    this.bigNumberRef = React.createRef();

    const increment = this.props.measurementsInCurrentSession || 0;
    const bigNumber = this.props.current || 0;
    const initialRank = getBadgeByNumberOfCases(bigNumber);

    this.state = {
      bigNumber,
      increment,
      progressValue: bigNumber,
      rank: initialRank,
      showRanksModal: false
    };

    this.toggleModal = this.toggleModal.bind(this);
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
          <img src={badge.img} alt={badge.name} />
          <h4 className="badgeName">{badge.name}</h4>
          <h6 className="badgeRequirement">{badge.description}</h6>
        </div>
      );
    });

    return badges;
  }

  animateRanks(ranks, finalValue) {
    const bigNumberElement = this.bigNumberRef.current;
    const incrementElement = this.incrementRef.current;
    const ranksToIterate = Array.from(ranks);

    const animateRank = () => {
      if (this.preventAnimations) {
        return;
      }

      const currentRank = ranksToIterate.shift();

      ReactTooltip.hide();
      if (!currentRank) {
        ReactTooltip.rebuild();
        return;
      }

      const bigNumber = ranksToIterate.length ? currentRank.max : finalValue;
      const increment = bigNumber - this.state.bigNumber;

      this.setState({ rank: currentRank });
      setTimeout(() => {
        if (this.preventAnimations) {
          return;
        }

        this.setState({ progressValue: bigNumber });
        const valueFrom = this.state.bigNumber;
        animateNumber(bigNumberElement, bigNumber, valueFrom, 3000, () => {
          if (this.preventAnimations) {
            return;
          }

          this.setState({ bigNumber });
          setTimeout(() => animateRank(), 300);
        });
      }, 2000);

      incrementElement.innerText = `+${increment}`;
    };

    animateRank();
  }

  componentDidUpdate(prevProps) {
    const oldCurrent = prevProps.current;
    const newCurrent = this.props.current;

    const newIncrement = this.props.measurementsInCurrentSession;

    if (newCurrent === oldCurrent) {
      return;
    }

    let ranks = [];
    if (oldCurrent === undefined) {
      ranks = [getBadgeByNumberOfCases(newCurrent)];
    } else if (newIncrement > 0) {
      ranks = this.getRanksFromTo(oldCurrent, newCurrent);
    }

    this.animateRanks(ranks, newCurrent);
  }

  getRanksFromTo(from, to) {
    const ranks = [];
    let current = from;
    let toIncrement = to - from;

    if (toIncrement > 0) {
      while (toIncrement !== 0) {
        const currentRank = getBadgeByNumberOfCases(current);
        const diff = currentRank.max - current;
        const iterationIncrement = diff <= toIncrement ? diff : toIncrement;

        ranks.push(currentRank);
        current += iterationIncrement;
        toIncrement -= iterationIncrement;

        if (toIncrement === 0 && current === currentRank.max) {
          ranks.push(getBadgeByNumberOfCases(current));
        }
      }
    }

    return ranks;
  }

  componentWillUnmount() {
    this.preventAnimations = true;
  }

  componentDidMount() {
    let ranks = [];
    const current = this.props.current || 0;
    const increment = this.props.measurementsInCurrentSession || 0;
    const finalValue = current + increment;

    if (finalValue > 0) {
      ranks = this.getRanksFromTo(current, finalValue);
    } else {
      ranks = [getBadgeByNumberOfCases(current)];
    }

    this.animateRanks(ranks, finalValue);
  }

  render() {
    const rank = this.state.rank;
    const bigNumber = this.state.bigNumber || 0;
    const formattedBigNumber = bigNumber.toLocaleString();

    const current = this.props.current || 0;
    const increment = this.props.increment || 0;
    const finalValue = current + increment;

    // Replace all numeric chars with the wider number in font (6)
    const fixedFinal = finalValue.toLocaleString().replace(/[0-9]/g, '6');

    return (
      <div className="ProgressSection">
        <div>
          <div className="numberCases">
            <div className="rankBadgeContainer">
              <RankBadge
                name={rank.name}
                img={rank.img}
                type={rank.type}
                description={rank.name}
                data-tip={rank.name}
                onClick={this.toggleModal}
              />
            </div>
            <div className="currentPoints">
              <span className="value">
                <span className="maxWidth noselect">{fixedFinal}</span>
                <span className="visible" ref={this.bigNumberRef}>
                  {formattedBigNumber}
                </span>
              </span>
              <span ref={this.incrementRef} className="plusPoints">
                +{increment}
              </span>
            </div>
          </div>
          <div className="progressBarContainer">
            <ProgressBar
              min={rank.min}
              max={rank.max}
              value={this.state.progressValue}
              startNumber={rank.min}
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
        >
          <h1>Ranks</h1>
          <div className="row">{this.getAllRankBadges(bigNumber)}</div>
          <span className="modal-close" onClick={this.toggleModal}>
            Close
          </span>
        </Modal>
      </div>
    );
  }
}

ProgressSection.propTypes = {
  current: PropTypes.number,
  measurementsInCurrentSession: PropTypes.number
};

export default ProgressSection;
