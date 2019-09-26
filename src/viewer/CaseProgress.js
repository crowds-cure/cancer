import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import './CaseProgress.css';

import sendSessionStatisticsToDatabase from './lib/sendSessionStatisticsToDatabase';
import saveAchievementsToDatabase from './lib/saveAchievementsToDatabase';
import animate from '../shared/animate';

class CaseProgress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionMeasurements: this.props.sessionMeasurements || 0,
      caseMeasurements: this.props.caseMeasurements || 0
    };

    this.sessionRef = React.createRef();
    this.incrementRef = React.createRef();
  }

  caseSelect = () => {
    this.props.history.push('/');
  };

  endSession() {
    const savedStartTime = this.props.sessionStart;
    const start = Math.round(savedStartTime / 1000);
    const end = Math.round(Date.now() / 1000);
    const { totalCompleteCollection } = this.props;
    const currentSession = {
      start,
      end,
      cases: this.props.measurementsInCurrentSession
    };

    sendSessionStatisticsToDatabase(currentSession).then(() => {
      // Determine and save the earned achievements
      // after session statistics are saved to db
      saveAchievementsToDatabase(totalCompleteCollection);
    });

    this.props.history.push('/session-summary');
  }

  componentDidUpdate() {
    if (this.state.sessionMeasurements !== this.props.sessionMeasurements) {
      const oldValue = this.state.sessionMeasurements || 0;

      this.setState({ sessionMeasurements: this.props.sessionMeasurements });
      animate(1000, progress => {
        const diff = this.props.sessionMeasurements - oldValue;
        const result = oldValue + diff * progress;
        const newValue = Math.floor(result);

        const element = this.sessionRef.current;
        const currentValue = parseInt(element.innerText, 10);

        if (newValue !== currentValue) {
          element.innerText = newValue;
        }
      });
    }

    const oldValue = this.state.caseMeasurements;
    const newValue = this.props.caseMeasurements;
    if (newValue === oldValue) {
      return;
    }

    const element = this.incrementRef.current;
    if (newValue === 0) {
      const callback = () => {
        element.removeEventListener('transitionend', callback);
        this.setState({ caseMeasurements: newValue });
      };

      element.addEventListener('transitionend', callback);
      element.classList.remove('shift');
    } else if (newValue === 1 && newValue > oldValue) {
      this.setState({ caseMeasurements: newValue });
      const callback = () => {
        element.classList.remove('slideIn');
        element.removeEventListener('animationend', callback);
      };

      element.addEventListener('animationend', callback);
      element.classList.add('slideIn');
    } else {
      const callback = () => {
        element.classList.remove('shift');
        element.removeEventListener('animationend', callback);
        this.setState({ caseMeasurements: newValue });
      };

      element.addEventListener('animationend', callback);
      element.classList.add('shift');
    }
  }

  getIncrementClass(caseMeasurements) {
    let className = `increment`;
    if (caseMeasurements) {
      className += ' visible';
    } else {
      className += ' hidden';
    }

    return className;
  }

  render() {
    return (
      <div className="d-flex no-gutters CaseProgress">
        <div className="sessionCount">
          <div className="value" ref={this.sessionRef}>
            0
          </div>
          <div
            className={this.getIncrementClass(this.props.caseMeasurements)}
            ref={this.incrementRef}
          >
            +{this.state.caseMeasurements}
          </div>
        </div>
        <div className="icon caseSelect" onClick={this.caseSelect}>
          <svg>
            <use xlinkHref="/icons.svg#icon-grid" />
          </svg>
          <div>Case select</div>
        </div>
        <div className="icon endSession" onClick={this.endSession}>
          <svg>
            <use xlinkHref="/icons.svg#icon-complete" />
          </svg>
          <div>End session</div>
        </div>
      </div>
    );
  }
}

CaseProgress.propTypes = {
  sessionMeasurements: PropTypes.number.isRequired,
  caseMeasurements: PropTypes.number.isRequired
};

export default withRouter(CaseProgress);
