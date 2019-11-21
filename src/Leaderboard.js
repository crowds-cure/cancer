import { Component } from 'react';
import React from 'react';
import SimpleHeaderSection from './shared/SimpleHeaderSection';
import LeaderboardItem from './shared/LeaderboardItem';
import { getTopAnnotators, getTopTeams } from './shared/getTopAnnotators';
import './Leaderboard.css';

import TEAM_LABELS from './shared/teams.js';

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topAnnotators: [],
      topTeams: []
    };

    this.updateLeaderboardData();
  }

  componentDidMount() {
    // TODO: Listen for changes in measurements db instead of querying db frequently
    this.leaderboardDataTimer = setInterval(() => {
      this.updateLeaderboardData();
    }, 30000);
  }

  componentWillUnmount() {
    clearTimeout(this.leaderboardDataTimer);
  }

  updateLeaderboardData() {
    // Retrieve top individuals this week
    getTopAnnotators(24).then(topAnnotators => {
      this.setState({
        topAnnotators
      });
    });
    // Retrieve top groups this week
    getTopTeams(10).then(topTeams => {
      this.setState({
        topTeams
      });
    });
  }

  getTopIndividualLeaderboardItems(startIndex, endIndex) {
    // Useful for testing scrolling limits
    //startIndex = 0
    //endIndex = 8

    const topAnnotatorsLimited = this.state.topAnnotators.slice(
      startIndex,
      endIndex
    );
    return topAnnotatorsLimited.map((item, index) => {
      const rank = startIndex + index + 1;
      const name = item.name;
      const principalName = item.principalName;
      const score = item.value;
      return (
        <LeaderboardItem
          key={'individual' + rank}
          rank={rank}
          name={name}
          principalName={principalName}
          score={score}
        />
      );
    });
  }

  getTopTeamLeaderboardItems(startIndex, endIndex) {
    // Useful for testing scrolling limits
    //startIndex = 0
    //endIndex = 5

    const topTeamsLimited = this.state.topTeams.slice(startIndex, endIndex);
    return topTeamsLimited.map((item, index) => {
      const rank = startIndex + index + 1;
      const name = TEAM_LABELS[item.name] || '';
      const score = item.value;
      return (
        <LeaderboardItem
          key={'team' + rank}
          rank={rank}
          name={name}
          score={score}
        />
      );
    });
  }

  getTopIndividualLeaderboardItemRows() {
    const columnLimit = 8;
    const numAnnotators = this.state.topAnnotators.length;
    // Useful for testing scrolling limits
    // const numAnnotators = 50

    // Create an index array for individual groups by column limit as 0, 8, 16, so on
    const indexes = [];
    for (let i = 0; i < numAnnotators; i = i + columnLimit) {
      indexes.push(i);
    }

    return indexes.map(index => (
      <div key={'individualRow' + index} className="col-sm-16 col-lg-5">
        {this.getTopIndividualLeaderboardItems(index, index + columnLimit)}
      </div>
    ));
  }

  getTopTeamLeaderboardItemRows() {
    const columnLimit = 5;
    const numTeams = this.state.topTeams.length;
    // Useful for testing scrolling limits
    // const numTeams = 50

    // Create an index array for top groups by column limit as 0, 5, 10, so on
    const indexes = [];
    for (let i = 0; i < numTeams; i = i + columnLimit) {
      indexes.push(i);
    }

    return indexes.map(index => (
      <div key={'teamRow' + index} className="col-sm-16 col-lg-8">
        {this.getTopTeamLeaderboardItems(index, index + columnLimit)}
      </div>
    ));
  }

  render() {
    return (
      <div className="Leaderboard">
        <SimpleHeaderSection />
        <div className="top-individuals">
          <div className="row title-container">
            <div className="col-sm-15 title"> TOP INDIVIDUALS</div>
          </div>
          <div className="row top-individuals-container">
            <div className="col-sm-15 content">
              <div className="row">
                {this.getTopIndividualLeaderboardItemRows()}
              </div>
            </div>
          </div>
        </div>
        <div className="top-groups">
          <div className="row title-container">
            <div className="col-sm-15 title"> TOP GROUPS</div>
          </div>
          <div className="row top-groups-container">
            <div className="col-sm-15">
              <div className="row">{this.getTopTeamLeaderboardItemRows()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Leaderboard;
