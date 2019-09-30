import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar.js';
import RankBadge from './RankBadge.js';

import './ProgressSection.css';
import { getBadgeByNumberOfCases } from '../badges';
import animateNumber from './animateNumber.js';

class ProgressSection extends Component {
  constructor(props) {
    super(props);

    this.incrementRef = React.createRef();
    this.bigNumberRef = React.createRef();

    const initialRank = getBadgeByNumberOfCases(this.props.current || 0);

    this.state = {
      current: this.props.current,
      measurementsInCurrentSession: this.props.measurementsInCurrentSession,
      bigNumber: this.props.current,
      increment: this.props.measurementsInCurrentSession,
      rank: initialRank,
      progressValue: this.props.current
    };
  }

  componentDidUpdate() {}

  render() {
    const rank = this.state.rank;
    const current = this.state.bigNumber;
    const increment = this.state.increment;

    return (
      <div className="ProgressSection">
        <div>
          <div className="numberCases">
            <div className="rankBadgeContainer">
              <RankBadge name={rank.name} img={rank.img} type={rank.type} />
            </div>
            <div className="currentPoints">
              <span ref={this.bigNumberRef} className="value">
                {current}
              </span>
              {increment ? (
                <span ref={this.incrementRef} className="plusPoints">
                  +{increment}
                </span>
              ) : (
                ''
              )}
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
      </div>
    );
  }

  componentDidMount = () => {
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
    let toIncrement = this.props.measurementsInCurrentSession;
    const finalValue = current + toIncrement;

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
            setTimeout(() => animateRank(), 1000);
          }
        );
      }, 1500);

      incrementElement.innerText = `+${increment}`;
    };

    animateRank();
  };

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
