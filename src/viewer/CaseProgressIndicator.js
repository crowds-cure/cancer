import { Component } from 'react';
import React from 'react';
import './CaseControlButtons.css';
import './CaseProgressIndicator.css';
import PropTypes from 'prop-types';

class CaseProgressIndicator extends Component {
  render() {
    return (
      <span className="CaseProgressIndicator">
        {this.props.casesInCurrentSession} Cases
      </span>
    );
  }
}

CaseProgressIndicator.propTypes = {
  casesInCurrentSession: PropTypes.number.isRequired
};

export default CaseProgressIndicator;
