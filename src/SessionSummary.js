import { Component } from 'react';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import { withRouter } from 'react-router-dom';

import './SessionSummary.css';

import ProgressSection from './shared/ProgressSection.js';
import PropTypes from 'prop-types';
import Logo from './shared/Logo';
import AchievementBadge from './shared/AchievementBadge.js';

import { achievements } from './achievements.js';
import animateNumber from './shared/animateNumber';

class SessionSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      score: this.props.current,
      sessionTotal: 0
    };

    this.sessionTotalRef = React.createRef();

    this.handleClickDashboard = this.handleClickDashboard.bind(this);
  }

  getSessionBadges(current) {
    const badges = [];

    // TODO: [layout] replace with real badges
    for (let i = 1; i <= 3; i++) {
      const id = `example0${i}`;
      const currentBadge = achievements[id];
      const { completed, description, imgActive, imgInactive } = currentBadge;
      const achievementImg = completed ? imgActive : imgInactive;
      badges.push(
        <div className="badgeWrapper col-16 col-xs-8 col-sm-third" key={id}>
          <div className="badge">
            <AchievementBadge img={achievementImg} description={description} />
            <div className="progress">
              {id === 'example03' ? (
                <div className="badgeProgress">
                  <div className="badgeProgressValue" />
                </div>
              ) : (
                <div className="badgeEarned">Badge earned</div>
              )}
              <div className="badgeDescription">{description}</div>
            </div>
          </div>
        </div>
      );
    }

    return badges;
  }

  componentDidMount() {
    const sessionTotalElement = this.sessionTotalRef.current;

    animateNumber(
      sessionTotalElement,
      this,
      'measurementsInCurrentSession',
      'sessionTotal'
    );
  }

  handleClickDashboard = () => {
    this.props.history.push('/');
  };

  performLogout() {
    window.auth.logout();
  }

  render() {
    return (
      <div className="SessionSummary">
        <Logo />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-15 col-sm-14 col-md-12 col-lg-10">
              <div className="pageHeader">
                <h1>
                  <span className="d-none d-sm-inline">Session </span>
                  Summary
                </h1>
                <div className="controlButtons">
                  <button className="logout" onClick={this.performLogout}>
                    Logout
                  </button>
                  <button
                    className="dashboard"
                    onClick={this.handleClickDashboard}
                  >
                    <span className="d-none d-sm-inline">Back to </span>
                    Dashboard
                  </button>
                </div>
              </div>
              <div className="sessionTotalSection cardSection">
                <h2>Session Total</h2>
                <div className="sessionTotalValue">
                  <span className="prefix">+</span>
                  <span className="value" ref={this.sessionTotalRef}>
                    0
                  </span>
                </div>
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
              <div className="earnedBadgesSection row justify-content-center">
                {this.getSessionBadges()}
              </div>
            </div>
          </div>
        </div>
        <ReactTooltip className="DashboardTooltip" effect="solid" />
      </div>
    );
  }
}

SessionSummary.propTypes = {
  current: PropTypes.number.isRequired,
  measurementsInCurrentSession: PropTypes.number.isRequired
};

export default withRouter(SessionSummary);
