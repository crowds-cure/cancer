import { Component } from 'react';
import React from 'react';
import './SessionSummary.css';

import ProgressSection from './shared/ProgressSection.js';
import LogoutSection from './shared/LogoutSection.js';
import PropTypes from 'prop-types';
import SimpleHeaderSection from './shared/SimpleHeaderSection';

class SessionSummary extends Component {
  static defaultProps = {
    current: 23,
    measurementsInCurrentSession: 1
  };

  render() {
    return (
      <div className="SessionSummary">
        <SimpleHeaderSection />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-15 col-md-10">
              <h1>Session Summary</h1>
              <div className="sessionTotalSection cardSection">
                <h2>Session Total</h2>
                <div className="sessionTotalValue">+{this.props.current}</div>
              </div>
              <div className="scoreSection cardSection">
                <h2>Score</h2>
                <ProgressSection
                  current={this.props.current}
                  measurementsInCurrentSession={
                    this.props.measurementsInCurrentSession
                  }
                />
              </div>
              <div className="earnedBadgesSection">
                <div className="badge" />
                <div className="badge" />
                <div className="badge" />
                <div className="badge" />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-16">{/* <LogoutSection /> */}</div>
          </div>
        </div>
      </div>
    );
  }
}

SessionSummary.propTypes = {
  current: PropTypes.number.isRequired,
  measurementsInCurrentSession: PropTypes.number.isRequired
};

export default SessionSummary;
