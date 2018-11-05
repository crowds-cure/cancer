import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import CaseFeedback from './CaseFeedback.js';

import './CaseControlButtons.css';

class CaseControlButtons extends Component {
  static defaultProps = {
    skipEnabled: false,
    saveEnabled: false,
    measurementsInCurrentSession: 0
  };

  render() {
    return (
      <div className="CaseControlButtons">
        <CaseFeedback
          feedbackChanged={this.props.feedbackChanged}
          skipEnabled={this.props.skipEnabled}
          skipCase={this.props.skipCase}
        />
        <button
          type="button"
          disabled={!this.props.saveEnabled}
          onClick={this.props.saveCase}
        >
          Complete
        </button>
      </div>
    );
  }
}

CaseControlButtons.propTypes = {
  skipEnabled: PropTypes.bool.isRequired,
  saveEnabled: PropTypes.bool.isRequired,
  skipCase: PropTypes.func.isRequired,
  saveCase: PropTypes.func.isRequired,
  feedbackChanged: PropTypes.func.isRequired,
  measurementsInCurrentSession: PropTypes.number.isRequired
};

export default CaseControlButtons;
