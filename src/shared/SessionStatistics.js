import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import getUserStatistics from './getUserStatistics.js';

import './SessionStatistics.css';

class SessionStatistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userStats: {}
    };

    getUserStatistics().then(userStats => {
      this.setState({
        userStats
      });
    });
  }

  render() {
    return (
      <div className="SessionStatistics">
        <div className="title">Session averages</div>
        <div className="statisticsItem">
          <svg className="icon">
            <use xlinkHref="/icons.svg#bars" />
          </svg>
          <span className="number">{this.state.userStats.measurements}</span>
          <span className="description">Measurements</span>
        </div>
        <div className="statisticsItem">
          <svg className="icon">
            <use xlinkHref="/icons.svg#bars" />
          </svg>
          <span className="number">{this.state.userStats.sessionMinutes}</span>
          <span className="description">Session Minutes</span>
        </div>
        <div className="statisticsItem">
          <svg className="icon">
            <use xlinkHref="/icons.svg#bars" />
          </svg>
          <span className="number">{this.state.userStats.sessionCases}</span>
          <span className="description">Session cases</span>
        </div>
        <div className="statisticsItem">
          <svg className="icon">
            <use xlinkHref="/icons.svg#bars" />
          </svg>
          <span className="number">{this.state.userStats.minutesPerCase}</span>
          <span className="description">Minutes per case</span>
        </div>
      </div>
    );
  }
}

SessionStatistics.propTypes = {
  measurements: PropTypes.number.isRequired
};

export default SessionStatistics;
