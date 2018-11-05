import { Component } from 'react';
import React from 'react';
import './SessionSummary.css';

import StatisticsSection from './shared/StatisticsSection.js';
import RankingSection from './shared/RankingSection.js';
import ProgressSection from './shared/ProgressSection.js';
import LogoutSection from './shared/LogoutSection.js';
import PropTypes from 'prop-types';
import SimpleHeaderSection from './shared/SimpleHeaderSection';

class SessionSummary extends Component {
  render() {
    return (
      <div className="SessionSummary">
        <SimpleHeaderSection />
        <div className="container">
          <div className="row align-items-center">
            <div className="col title-wrapper">
              <label className="title">SESSION SUMMARY</label>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-10">
              <ProgressSection
                current={this.props.current}
                measurementsInCurrentSession={
                  this.props.measurementsInCurrentSession
                }
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-6">
              <LogoutSection />
            </div>
          </div>
          <div className="row">
            <div className="col-10 communityStats">
              <StatisticsSection />
            </div>
            <div className="col-6 rankingStats">
              <div className="row">
                <div className="col">
                  <RankingSection name="Close to you" />
                </div>
                <div className="col">
                  <RankingSection name="Top this week" />
                </div>
              </div>
            </div>
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
