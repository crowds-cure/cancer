import { Component } from 'react';
import React from 'react';
import './SessionSummary.css';

import StatisticsSection from './shared/StatisticsSection.js';
import RankingSection from './shared/RankingSection.js';
import ProgressSection from './shared/ProgressSection.js';
import LogoutSection from './shared/LogoutSection.js';
import PropTypes from 'prop-types';

class SessionSummary extends Component {
  render() {
    return (
      <div className="SessionSummary">
        <span className="title">Session Summary</span>

        {/* TODO: Top bar? */}
        {/* TODO: Logo in Top bar? */}
        <ProgressSection
          current={this.props.current}
          numCasesInSession={this.props.numCasesInSession}
        />
        <LogoutSection />
        <div>
          <StatisticsSection />
          <div>
            <RankingSection name="Close to you" />
            <RankingSection name="Top this week" />
          </div>
        </div>
      </div>
    );
  }
}

SessionSummary.propTypes = {
  current: PropTypes.number.isRequired,
  casesInCurrentSession: PropTypes.number.isRequired
};

export default SessionSummary;
