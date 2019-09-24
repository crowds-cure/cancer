import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

import './CaseProgress.css';

class CaseProgress extends Component {
  render() {
    return (
      <div className="d-flex no-gutters CaseProgress">
        <div className="sessionCount">
          <div className="value">{this.props.sessionMeasurements}</div>
          <div className="increment">+{this.props.caseMeasurements}</div>
        </div>
        <div className="icon caseSelect">
          <svg>
            <use xlinkHref="/icons.svg#icon-grid" />
          </svg>
          <div>Case select</div>
        </div>
        <div className="icon endSession">
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

export default CaseProgress;
