import { Component } from 'react';
import React from 'react';
import Logo from './shared/Logo.js';
import LeaderboardItem from './shared/LeaderboardItem';
import { getTopAnnotators, getTopTeams } from './shared/getTopAnnotators';
import leaderboardIndividuals from './images/general/leaderboard-individuals.svg';
import leaderboardTeams from './images/general/leaderboard-teams.svg';
import './Leaderboard.css';
import './LeaderboardFit.css';

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

  getTopIndividualLeaderboardItems() {
    return this.state.topAnnotators.map((item, index) => {
      const rank = index + 1;
      const { name, principalName, teamName } = item;
      const score = item.value;
      const teamLabel = TEAM_LABELS[teamName] || '';
      return (
        <LeaderboardItem
          key={'individual' + rank}
          rank={rank}
          name={name}
          principalName={principalName}
          teamLabel={teamLabel}
          score={score}
        />
      );
    });
  }

  getTopTeamLeaderboardItems() {
    return this.state.topTeams.map((item, index) => {
      const rank = index + 1;
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

  getClassName = () => {
    let className = 'Leaderboard';
    if (this.props.fitScreen) {
      className += ' fitScreen';
    }

    return className;
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <Logo />
        <div className="section sectionIndividuals">
          <h2>
            <img src={leaderboardIndividuals} alt="Individuals" />
            <span>Top Individuals</span>
          </h2>
          <div className="list">
            {this.getTopIndividualLeaderboardItems()}
          </div>
        </div>
        <div className="section sectionTeams">
          <h2>
            <img src={leaderboardTeams} alt="Teams" />
            <span>Top Teams</span>
          </h2>
          <div className="list">
            {this.getTopTeamLeaderboardItems()}
          </div>
        </div>
      </div>
    );
  }
}

export default Leaderboard;
