import { Component } from 'react';
import React from 'react';
import './CaseControlButtons.css';
import { Link } from 'react-router-dom';
import CaseFeedback from './CaseFeedback.js';
import CaseProgressIndicator from './CaseProgressIndicator.js';
import PropTypes from 'prop-types';

class CaseControlButtons extends Component {
  render() {
    return (
      <div className="CaseControlButtons">
        <CaseFeedback feedbackChanged={this.props.feedbackChanged} />
        <div className="btn-group">
          <button type="button" onClick={this.props.skipCase}>
            Skip
          </button>
          <button type="button" onClick={this.props.saveCase}>
            Save
          </button>
        </div>
        <CaseProgressIndicator
          casesInCurrentSession={this.props.casesInCurrentSession}
        />
        <Link to="/session-summary">End Session</Link>
      </div>
    );
  }
}

CaseControlButtons.propTypes = {
  skipCase: PropTypes.func.isRequired,
  saveCase: PropTypes.func.isRequired,
  feedbackChanged: PropTypes.func.isRequired,
  casesInCurrentSession: PropTypes.number.isRequired
};

export default CaseControlButtons;
