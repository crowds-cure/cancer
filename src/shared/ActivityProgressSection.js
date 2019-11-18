import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import InfoBox from './InfoBox.js';
import './ActivityProgressSection.css';
import ProgressSection from './ProgressSection.js';

class ActivityProgressSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: props.current,
      measurementsInCurrentSession: 0
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.current !== prevProps.current) {
      const inSession = this.props.current - (prevProps.current || 0);
      this.setState({
        current: this.props.current,
        measurementsInCurrentSession: inSession
      });
    }
  }

  render() {
    return (
      <InfoBox className="ActivityProgressSection" headerText="Score and rank">
        <ProgressSection
          current={this.state.current}
          measurementsInCurrentSession={this.state.measurementsInCurrentSession}
        />
        {this.props.rank ? (
          <div className="d-none d-md-block leaderboardRank">
            <div className="position">{this.props.rank}</div>
            <div className="description">
              Leaderboard
              <br />
              Rank
            </div>
          </div>
        ) : ''}
      </InfoBox>
    );
  }
}

ActivityProgressSection.propTypes = {
  current: PropTypes.number
};

export default ActivityProgressSection;
