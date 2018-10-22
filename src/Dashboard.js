import { Component } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

import StatisticsSection from './shared/StatisticsSection.js';
import RankingSection from './shared/RankingSection.js';
import ProgressSection from './shared/ProgressSection.js';
import CaseTypeSection from './shared/CaseTypeSection.js';
//import AchievementSection from './shared/AchievementSection.js';
import './Dashboard.css';

class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard">
        <div className="column" id="left">
          <div className="top-left">
            <div className="logo">
              <span className="logoText highlight">Crowds </span>
              <span className="logoText">Cure Cancer</span>
            </div>
          </div>
          <div className="bottom">
            <StatisticsSection />
            <div>
              <RankingSection name="Close to you" />
              <RankingSection name="Top this week" />
            </div>
          </div>
        </div>
        <div className="column" id="right">
          <div className="top-right">
            <nav>
              <Link to="/create-account">Create Account</Link>

              {/* These links are just for testing purposes */}
              <Link to="/viewer">Viewer</Link>
              <Link to="/session-summary">Session Summary</Link>
              <span onClick={this.logout}>Log out</span>
            </nav>
          </div>
          <div className="bottom">
            <ProgressSection />
            {/*<AchievementSection />*/}
            <CaseTypeSection />
          </div>
        </div>
      </div>
    );
  }

  logout() {
    window.auth.logout();
  }
}

export default Dashboard;
