import { Component } from 'react';
import React from 'react';
import './CaseControlButtons.css';
import { withRouter } from 'react-router-dom';
import CaseFeedback from './CaseFeedback.js';
import CaseProgressIndicator from './CaseProgressIndicator.js';
import PropTypes from 'prop-types';
import sendSessionStatisticsToDatabase from './lib/sendSessionStatisticsToDatabase.js';

class CaseControlButtons extends Component {
  constructor(props) {
    super(props);

    this.endSession = this.endSession.bind(this);
  }

  static defaultProps = {
    skipEnabled: false,
    saveEnabled: false,
    casesInCurrentSession: 0
  };

  render() {
    return (
      <div className="CaseControlButtons">
        <CaseFeedback feedbackChanged={this.props.feedbackChanged} />
        <div className="btn-group">
          <button
            type="button"
            disabled={!this.props.skipEnabled}
            onClick={this.props.skipCase}
          >
            Skip
          </button>
          <button
            type="button"
            disabled={!this.props.saveEnabled}
            onClick={this.props.saveCase}
          >
            Save
          </button>
        </div>
        <CaseProgressIndicator
          casesInCurrentSession={this.props.casesInCurrentSession}
        />
        <button onClick={this.endSession}>End Session</button>
      </div>
    );
  }

  endSession() {
    const savedStartTime = this.props.sessionStart;
    const start = Math.round(savedStartTime / 1000);
    const end = Math.round(Date.now() / 1000);

    const currentSession = {
      start,
      end,
      cases: this.props.casesInCurrentSession
    };

    sendSessionStatisticsToDatabase(currentSession);

    this.props.history.push('/session-summary');
  }
}

CaseControlButtons.propTypes = {
  sessionStart: PropTypes.number.isRequired,
  skipEnabled: PropTypes.bool.isRequired,
  saveEnabled: PropTypes.bool.isRequired,
  skipCase: PropTypes.func.isRequired,
  saveCase: PropTypes.func.isRequired,
  feedbackChanged: PropTypes.func.isRequired,
  casesInCurrentSession: PropTypes.number.isRequired
};

export default withRouter(CaseControlButtons);
