import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import './CaseProgress.css';

import sendSessionStatisticsToDatabase from './lib/sendSessionStatisticsToDatabase';
import saveAchievementsToDatabase from './lib/saveAchievementsToDatabase';
import animateNumber from '../shared/animateNumber';
import waitForAnimation from '../shared/waitForAnimation';

class CaseProgress extends Component {
  constructor(props) {
    super(props);

    this.animationsPromise = Promise.resolve();

    this.state = {
      sessionMeasurements: this.props.sessionMeasurements || 0,
      caseMeasurements: this.props.caseMeasurements || 0,
      incrementText: this.props.caseMeasurements || 0
    };

    this.sessionRef = React.createRef();
    this.incrementRef = React.createRef();

    this.caseSelect = this.caseSelect.bind(this);
    this.endSession = this.endSession.bind(this);
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
    const sessionElement = this.sessionRef.current;

    if (this.state.sessionMeasurements !== this.props.sessionMeasurements) {
      this.setState({ sessionMeasurements: this.props.sessionMeasurements });
      animateNumber(
        sessionElement,
        this,
        'sessionMeasurements',
        'sessionMeasurements',
        1000
      );
    }

    const oldIncrementValue = this.state.caseMeasurements;
    const newIncrementValue = this.props.caseMeasurements;
    if (newIncrementValue !== oldIncrementValue) {
      this.animateIncrement(oldIncrementValue, newIncrementValue);
    }
  }

  async animateIncrement(oldValue, newValue) {
    await this.animationsPromise;
    this.setState({ caseMeasurements: newValue });

    const element = this.incrementRef.current;
    if (!element) {
      return;
    } else if (newValue === 0) {
      this.animationsPromise = waitForAnimation(element, 'slideOut');
      await this.animationsPromise;
      this.setState({ incrementText: newValue });
    } else if (newValue === 1 && newValue > oldValue) {
      this.setState({ incrementText: newValue });
      this.animationsPromise = waitForAnimation(element, 'slideIn');
    } else {
      this.animationsPromise = waitForAnimation(element, 'shift');
      await this.animationsPromise;
      if (this.props.caseMeasurements === newValue) {
        this.setState({ incrementText: newValue });
      }
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
            className={this.getIncrementClass(this.state.caseMeasurements)}
            ref={this.incrementRef}
          >
            +{this.state.incrementText}
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
