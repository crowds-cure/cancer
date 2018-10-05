import { Component } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

import StatisticsSection from './shared/StatisticsSection.js';
import RankingSection from './shared/RankingSection.js';
import ProgressSection from './shared/ProgressSection.js';
import CaseTypeSection from './shared/CaseTypeSection.js';
import AchievementSection from './shared/AchievementSection.js';
import './Dashboard.css';

class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard">
        <div className="column" id="left">
          <div className="top-left">
            <h1>Crowds Cure Cancer</h1>
          </div>
          <div className="bottom">
            <StatisticsSection />
            <div>
              <RankingSection name="Close to you" />
              <RankingSection name="Top this week" />
            </div>
            <AchievementSection />
          </div>
        </div>
        <div className="column" id="right">
          <div className="top-right">
            <nav>
              <Link to="/create-account">Create Account</Link>
              <Link to="/viewer">Viewer</Link>
            </nav>
          </div>
          <div className="bottom">
            <ProgressSection />
            <CaseTypeSection />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
