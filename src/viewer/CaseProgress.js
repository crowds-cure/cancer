import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import './CaseProgress.css';

import sendSessionStatisticsToDatabase from './lib/sendSessionStatisticsToDatabase';
import saveAchievementsToDatabase from './lib/saveAchievementsToDatabase';

class CaseProgress extends Component {
  caseSelect = () => {
    this.props.history.push('/');
  };

  endSession() {
    const savedStartTime = this.props.sessionStart;
    const start = Math.round(savedStartTime / 1000);
    const end = Math.round(Date.now() / 1000);

    const currentSession = {
      start,
      end,
      cases: this.props.measurementsInCurrentSession
    };

    const { totalCompleteCollection } = this.props;

    sendSessionStatisticsToDatabase(currentSession).then(() => {
      // Determine and save the earned achievements
      // after session statistics are saved to db
      saveAchievementsToDatabase(totalCompleteCollection);
    });

    this.props.history.push('/session-summary');
  }

  render() {
    return (
      <div className="d-flex no-gutters CaseProgress">
        <div className="sessionCount">
          <div className="value">{this.props.sessionMeasurements}</div>
          <div className="increment">+{this.props.caseMeasurements}</div>
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
