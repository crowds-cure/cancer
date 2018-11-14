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
      <div className="CaseControlButtons d-none d-md-inline">
        <CaseFeedback
          feedbackSelected={this.props.feedbackSelected}
          feedbackChanged={this.props.feedbackChanged}
          skipEnabled={this.props.skipEnabled}
          skipCase={this.props.skipCase}
        />
        <div className="CompleteButtonWrapper">
          <button
            className="complete-case"
            type="button"
            disabled={!this.props.saveEnabled}
            onClick={this.props.saveCase}
          >
            <svg>
              <use xlinkHref="/icons.svg#icon-check-circle" />
            </svg>
            <span>Complete</span>
          </button>
        </div>
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
  feedbackSelected: PropTypes.array.isRequired,
  measurementsInCurrentSession: PropTypes.number.isRequired
};

export default CaseControlButtons;
