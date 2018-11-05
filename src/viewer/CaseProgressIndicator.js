import { Component } from 'react';
import React from 'react';
import './CaseControlButtons.css';
import './CaseProgressIndicator.css';
import PropTypes from 'prop-types';

class CaseProgressIndicator extends Component {
  render() {
    return (
      <div className="CaseProgressIndicator">
        <span className="cases">{this.props.measurementsInCurrentSession}</span>
        <div className="casesLabel">SESSION MEASUREMENTS</div>
      </div>
    );
  }
}

CaseProgressIndicator.propTypes = {
  measurementsInCurrentSession: PropTypes.number.isRequired
};

export default CaseProgressIndicator;
