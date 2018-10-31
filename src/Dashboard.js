import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

import StatisticsSection from './shared/StatisticsSection.js';
import RankingSection from './shared/RankingSection.js';
import ActivityProgressSection from './shared/ActivityProgressSection.js';
import CaseTypeSection from './shared/CaseTypeSection.js';
import SimpleHeaderSection from './shared/SimpleHeaderSection.js';
//import AchievementSection from './shared/AchievementSection.js';

import './Dashboard.css';
import getUserStats from './shared/getUserStats';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userStats: {}
    };

    getUserStats().then(userStats => {
      this.setState({
        userStats
      });
    });
  }

  render() {
    const current = this.state.userStats.current;

    return (
      <div className="Dashboard">
        <div className="container">
          <div className="row">
            <div className="col">
              <SimpleHeaderSection />
              {/* These will be styled soon */}
              <span className="Logout">{this.props.username} </span>
              <span className="Logout" onClick={this.logout}>
                Log out
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-5 offset-lg-4 col-md-7 offset-md-2">
              <ActivityProgressSection current={current} />
              {/*<AchievementSection />*/}
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-16 order-2 order-lg-1">
                <div className="row">
                  <div className="col-lg-16 col-md-8 col-sm-16">
                    <StatisticsSection col="8" />
                  </div>
                  <div className="col-lg-16 col-md-8 col-sm-16">
                    <div className="row">
                      <div className="col-16">
                        <RankingSection name="Close to you" />
                      </div>
                      <div className="col-16">
                        <RankingSection name="Top this week" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-16 col-sm-16 order-1 order-lg-2">
                <div className="row">
                  <div className="col-16">
                    <CaseTypeSection />
                  </div>
                </div>
              </div>
            </div>
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
  current: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired
};

export default Dashboard;
