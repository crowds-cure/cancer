import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar.js';
import RankBadge from './RankBadge.js';

import './ProgressSection.css';
import { getBadgeByNumberOfCases } from '../badges';

class ProgressSection extends Component {
  constructor(props) {
    super(props);

    this.plusPoints = React.createRef();
    this.currentValue = React.createRef();

    this.state = {
      current: this.props.current,
      measurementsInCurrentSession: this.props.measurementsInCurrentSession
    };
  }

  render() {
    const rank = getBadgeByNumberOfCases(this.state.current);
    const current = this.state.current ? this.state.current : 0;
    const increment = this.state.measurementsInCurrentSession;

    return (
      <div className="ProgressSection">
        <div>
          <div className="numberCases">
            <div className="rankBadgeContainer">
              <RankBadge name={rank.name} img={rank.img} type={rank.type} />
            </div>
            <div className="currentPoints">
              <span ref={this.currentValue} className="value">
                {current}
              </span>
              <span className="suffix">measured</span>
              {increment ? (
                <span ref={this.plusPoints} className="plusPoints">
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
              value={current}
              increment={increment}
              startNumber={rank.min}
              endNumber={rank.max}
            />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount = () => {
    if (this.plusPoints.current) {
      setTimeout(() => {
        this.plusPointsAnimation();
      });
      setTimeout(() => {
        this.currentValueAnimation();
      }, 2100);
    }
  };

  plusPointsAnimation = () => {
    this.plusPoints.current.classList.add('fadeInAndSlideDown');
    setTimeout(() => {
      setTimeout(() => {
        this.plusPoints.current.classList.remove('fadeInAndSlideDown');
        this.plusPoints.current.classList.add('fadeOutAndSlideDown');
      }, 1700);
    }, 300);
  };

  currentValueAnimation = () => {
    this.currentValue.current.classList.add('moveDown');
    setTimeout(() => {
      this.currentValue.current.classList.remove('moveDown');
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
