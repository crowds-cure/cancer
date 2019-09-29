import { Component } from 'react';
import React from 'react';
import './SessionSummary.css';

import ProgressSection from './shared/ProgressSection.js';
import LogoutSection from './shared/LogoutSection.js';
import PropTypes from 'prop-types';
import Logo from './shared/Logo';

import animateNumber from './shared/animateNumber';

class SessionSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      score: this.props.current,
      sessionTotal: 0
    };

    this.sessionTotalRef = React.createRef();
  }

  componentDidMount() {
    const sessionTotalElement = this.sessionTotalRef.current;
    console.log('PROPS', this.props);

    animateNumber(
      sessionTotalElement,
      this,
      'measurementsInCurrentSession',
      'sessionTotal'
    );
  }

  render() {
    return (
      <div className="SessionSummary">
        <Logo />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-15 col-sm-14 col-md-12 col-lg-10">
              <h1>Session Summary</h1>
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
                <div className="badgeWrapper col-16 col-xs-8 col-sm-third">
                  <div className="badge" />
                </div>
                <div className="badgeWrapper col-16 col-xs-8 col-sm-third">
                  <div className="badge" />
                </div>
                <div className="badgeWrapper col-16 col-xs-8 col-sm-third">
                  <div className="badge" />
                </div>
                <div className="badgeWrapper col-16 col-xs-8 col-sm-third">
                  <div className="badge" />
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-16">{/* <LogoutSection /> */}</div>
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
