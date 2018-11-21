import { Component } from 'react';
import React from 'react';
import SimpleHeaderSection from './shared/SimpleHeaderSection';
import LeaderboardItem from './shared/LeaderboardItem';
import {
  getTopAnnotatorsByWeek,
  getTopTeamsByWeek
} from './shared/getTopAnnotators';
import './Leaderboard.css';

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
    getTopAnnotatorsByWeek(24).then(topAnnotators => {
      this.setState({
        topAnnotators
      });
    });
    // Retrieve top groups this week
    getTopTeamsByWeek(10).then(topTeams => {
      this.setState({
        topTeams
      });
    });
  }

  getTopIndividualLeaderboardItems(startIndex, endIndex) {
    const topAnnotatorsLimited = this.state.topAnnotators.slice(
      startIndex,
      endIndex
    );
    return topAnnotatorsLimited.map((item, index) => {
      const rank = startIndex + index + 1;
      const name = item.name[1];
      const score = item.value;
      return (
        <LeaderboardItem
          key={'individual' + rank}
          rank={rank}
          name={name}
          score={score}
        />
      );
    });
  }

  getTopTeamLeaderboardItems(startIndex, endIndex) {
    const topTeamsLimited = this.state.topTeams.slice(startIndex, endIndex);
    return topTeamsLimited.map((item, index) => {
      const rank = startIndex + index + 1;
      const name = item[0];
      const score = item[1];
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

    // Create an index array for individual groups by column limit as 0, 8, 16, so on
    const indexes = [];
    for (let i = 0; i < this.state.topAnnotators.length; i = i + columnLimit) {
      indexes.push(i);
    }

    return indexes.map(index => (
      <div key={'individualRow' + index} className="col-lg-5">
        {this.getTopIndividualLeaderboardItems(index, index + columnLimit)}
      </div>
    ));
  }

  getTopTeamLeaderboardItemRows() {
    const columnLimit = 5;

    // Create an index array for top groups by column limit as 0, 5, 10, so on
    const indexes = [];
    for (let i = 0; i < this.state.topTeams.length; i = i + columnLimit) {
      indexes.push(i);
    }

    return indexes.map(index => (
      <div key={'teamRow' + index} className="col-lg-8">
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
            <div className="col-lg-15 title"> TOP INDIVIDUALS</div>
          </div>
          <div className="row top-individuals-container">
            <div className="col-lg-15 content">
              <div className="row">
                {this.getTopIndividualLeaderboardItemRows()}
              </div>
            </div>
          </div>
        </div>
        <div className="top-groups">
          <div className="row title-container">
            <div className="col-lg-15 title"> TOP GROUPS</div>
          </div>
          <div className="row top-groups-container">
            <div className="col-lg-15">
              <div className="row">{this.getTopTeamLeaderboardItemRows()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Leaderboard;
