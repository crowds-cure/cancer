import { Component } from 'react';
import React from 'react';
import StatisticsCard from './StatisticsCard.js';
import InfoBox from './InfoBox.js';
import './StatisticsSection.css';
import getCommunityStats from './getCommunityStats.js';
import iconCommunityEye from '../images/general/icon-community-eye.svg';
import iconCommunityPerson from '../images/general/icon-community-person.svg';
import iconCommunityCalendar from '../images/general/icon-community-calendar.svg';

class StatisticsSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      communityStats: {}
    };

    getCommunityStats().then(communityStats => {
      this.setState({
        communityStats
      });
    });
  }

  render() {
    const { communityStats } = this.state;

    const {
      totalMeasurements,
      numAnnotators,
      recentMeasurements
    } = communityStats;

    const stats = [
      {
        number: totalMeasurements,
        icon: iconCommunityEye,
        description: (
          <span>
            Total community
            <br />
            measurements
          </span>
        )
      },
      {
        number: numAnnotators,
        icon: iconCommunityPerson,
        description: <span>Total participants</span>
      },
      {
        number: recentMeasurements,
        icon: iconCommunityCalendar,
        description: (
          <span>
            Measurements
            <br />
            in last 24 hours
          </span>
        )
      }
    ];

    const items = stats.map((item, index) => (
      <div key={index} className="d-block col-sm cardContainer">
        <StatisticsCard {...item} />
      </div>
    ));

    return (
      <InfoBox className="StatisticsSection" headerText="Community">
        <div className="d-sm-flex no-gutters">{items}</div>
      </InfoBox>
    );
  }
}

export default StatisticsSection;
