import { Component } from 'react';
import React from 'react';
import './SessionStatistics.css';
import PropTypes from 'prop-types';

class SessionStatistics extends Component {
  render() {
    const measurements = this.props.measurements;
    const sessionMinutes = 27;
    const sessionCases = 4;
    const minutesPerCase = 7;

    return (
      <div className="SessionStatistics">
        <div className="title">Session averages</div>
        <div className="statisticsItem">
          <svg className="icon">
            <use xlinkHref="/icons.svg#bars" />
          </svg>
          <span className="number">{measurements}</span>
          <span className="description">Measurements</span>
        </div>
        <div className="statisticsItem">
          <svg className="icon">
            <use xlinkHref="/icons.svg#bars" />
          </svg>
          <span className="number">{sessionMinutes}</span>
          <span className="description">Session Minutes</span>
        </div>
        <div className="statisticsItem">
          <svg className="icon">
            <use xlinkHref="/icons.svg#bars" />
          </svg>
          <span className="number">{sessionCases}</span>
          <span className="description">Session cases</span>
        </div>
        <div className="statisticsItem">
          <svg className="icon">
            <use xlinkHref="/icons.svg#bars" />
          </svg>
          <span className="number">{minutesPerCase}</span>
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
