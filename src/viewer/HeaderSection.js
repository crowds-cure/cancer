import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import CaseProgressIndicator from './CaseProgressIndicator.js';

import './HeaderSection.css';

class HeaderSection extends Component {
  render() {
    return (
      <div className="HeaderSection row">
        <div className="col">
          <div className="logo">
            <span className="logoText highlight">Crowds </span>
            <span className="logoText">Cure Cancer</span>
          </div>
        </div>
        <div className="col">
          <div className="caseProgress">
            <CaseProgressIndicator
              casesInCurrentSession={this.props.casesInCurrentSession}
            />
          </div>
          <div className="endSession">
            <Link to="/session-summary" className="link">
              End Session
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

HeaderSection.propTypes = {
  casesInCurrentSession: PropTypes.number.isRequired
};

export default HeaderSection;
