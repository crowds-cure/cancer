import { Component } from 'react';
import React from 'react';

import StatisticsSection from './shared/StatisticsSection.js';
import RankingSection from './shared/RankingSection.js';
import ProgressSection from './shared/ProgressSection.js';
import LogoutSection from './shared/LogoutSection.js';

class SessionSummary extends Component {
  render() {
    return (
      <div className="SessionSummary">
        {/* TODO: Top bar? */}
        {/* TODO: Logo in Top bar? */}
        <div>
          <ProgressSection />
        </div>
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

export default SessionSummary;
