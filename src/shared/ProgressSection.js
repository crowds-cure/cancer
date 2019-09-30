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

    this.incrementRef = React.createRef();
    this.bigNumberRef = React.createRef();

    const initialRank = getBadgeByNumberOfCases(this.props.current || 0);
    const measurementsInCurrentSession =
      this.props.measurementsInCurrentSession || 0;

    this.state = {
      current: this.props.current,
      measurementsInCurrentSession,
      bigNumber: this.props.current,
      increment: measurementsInCurrentSession,
      rank: initialRank,
      progressValue: this.props.current,
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
          <img src={badge.img} alt={badge.name} data-tip={badge.description} />
          <h4 className="badgeName">{badge.name}</h4>
        </div>
      );
    });

    return badges;
  }

  render() {
    const rank = this.state.rank;
    const current = this.state.bigNumber || 0;
    const increment = this.state.increment || 0;

    // Replace all numeric chars with the wider number in font (6)
    const formattedCurrent = current.toLocaleString();
    const fixedCurrent = formattedCurrent.replace(/[0-9]/g, '6');

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
                <span className="maxWidth noselect">{fixedCurrent}</span>
                <span className="visible" ref={this.bigNumberRef}>
                  {formattedCurrent}
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
          <div className="row">{this.getAllRankBadges(current)}</div>
          <span className="modal-close" onClick={this.toggleModal}>
            Close
          </span>
        </Modal>
      </div>
    );
  }

  componentDidMount() {
    ReactTooltip.rebuild();

    if (this.incrementRef.current) {
      setTimeout(() => {
        this.plusPointsAnimation();
      });
      //   setTimeout(() => {
      //     this.currentValueAnimation();
      //   }, 2100);
    }

    const ranks = [];
    let current = this.props.current;
    let toIncrement = this.props.measurementsInCurrentSession || 0;
    const finalValue = current + toIncrement;

    if (toIncrement > 0) {
      while (current !== finalValue) {
        const currentRank = getBadgeByNumberOfCases(current);
        const diff = currentRank.max - current;

        ranks.push(currentRank);
        if (diff <= toIncrement) {
          toIncrement -= diff;
          current += diff;
        } else {
          current += toIncrement;
        }
      }
    } else {
      const currentRank = getBadgeByNumberOfCases(current);
      ranks.push(currentRank);
    }

    const bigNumberElement = this.bigNumberRef.current;
    const incrementElement = this.incrementRef.current;

    const animateRank = () => {
      const currentRank = ranks.shift();

      if (!currentRank) {
        return;
      }

      const bigNumber = ranks.length ? currentRank.max : finalValue;
      const increment = bigNumber - this.state.bigNumber;

      this.setState({ rank: currentRank });
      setTimeout(() => {
        this.setState({ progressValue: bigNumber });
        animateNumber(
          bigNumberElement,
          this,
          bigNumber,
          'bigNumber',
          3000,
          () => {
            this.setState({ bigNumber });
            setTimeout(() => animateRank(), 300);
          }
        );
      }, 2000);

      incrementElement.innerText = `+${increment}`;
    };

    animateRank();
  }

  plusPointsAnimation = () => {
    // this.incrementRef.current.classList.add('fadeInAndSlideDown');
    // setTimeout(() => {
    //   setTimeout(() => {
    //     this.incrementRef.current.classList.remove('fadeInAndSlideDown');
    //     this.incrementRef.current.classList.add('fadeOutAndSlideDown');
    //   }, 1700);
    // }, 300);
  };

  currentValueAnimation = () => {
    this.bigNumberRef.current.classList.add('moveDown');
    setTimeout(() => {
      this.bigNumberRef.current.classList.remove('moveDown');
      setTimeout(() => {
        this.setState({
          current: this.state.current + this.state.measurementsInCurrentSession,
          measurementsInCurrentSession: null
        });
      }, 100);
    }, 100);
  };
}

ProgressSection.propTypes = {
  current: PropTypes.number,
  measurementsInCurrentSession: PropTypes.number
};

export default ProgressSection;
