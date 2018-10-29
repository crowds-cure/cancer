import { Component } from 'react';
import React from 'react';

import StatisticsSection from './shared/StatisticsSection.js';
import RankingSection from './shared/RankingSection.js';
import ProgressSection from './shared/ProgressSection.js';
import CaseTypeSection from './shared/CaseTypeSection.js';
//import AchievementSection from './shared/AchievementSection.js';
import './Dashboard.css';
import PropTypes from 'prop-types';

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
              <span className="Logout" onClick={this.logout}>
                Log out
              </span>
            </nav>
          </div>
          <div className="bottom">
            <ProgressSection current={this.props.current} />
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

Dashboard.propTypes = {
  current: PropTypes.number.isRequired
};

export default Dashboard;
