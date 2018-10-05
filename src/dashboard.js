import { Component } from 'react';
import React from 'react';

import StatisticsSection from './shared/StatisticsSection.js';
import RankingSection from './shared/RankingSection.js';
import ProgressSection from './shared/ProgressSection.js';
import CaseTypeSection from './shared/CaseTypeSection.js';
import AchievementSection from './shared/AchievementSection.js';

class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard">
        <div>
          <StatisticsSection />
          <RankingSection name="Close to you" />
          <RankingSection name="Top this week" />
        </div>
        <div>
          <ProgressSection />
          <CaseTypeSection />
          <AchievementSection />
        </div>
      </div>
    );
  }
}

export default Dashboard;
