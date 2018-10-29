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
        <div>
          <SimpleHeaderSection />
        </div>
        <div className="title-wrapper">
          <label className="title">SESSION SUMMARY</label>
        </div>
        <div>
          <ProgressSection
            current={this.props.current}
            numCasesInSession={this.props.numCasesInSession} />
        </div>
        <div>
          <LogoutSection />
        </div>
        <div>
          <div className="communityStats">
            <StatisticsSection />
          </div>
          <div className="rankingStats">
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
