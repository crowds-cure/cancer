import { Component } from 'react';
import React from 'react';
import './CaseControlButtons.css';
import { Link } from 'react-router-dom';
import CaseProgressIndicator from './CaseProgressIndicator.js';

class CaseControlButtons extends Component {
  render() {
    return (
      <div className="CaseControlButtons">
        <button type="button">Case Feedback</button>
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

export default CaseControlButtons;
