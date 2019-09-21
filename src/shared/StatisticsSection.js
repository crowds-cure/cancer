import { Component } from 'react';
import React from 'react';
import StatisticsCard from './StatisticsCard.js';
import InfoBox from './InfoBox.js';
import './StatisticsSection.css';
//import PropTypes from 'prop-types';
import getCommunityStats from './getCommunityStats.js';

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

    // TODO: [layout] Add SVG icon reference to stats statistics object
    const stats = [
      {
        number: totalMeasurements,
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
        description: <span>Total participants</span>
      },
      {
        number: recentMeasurements,
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

StatisticsSection.propTypes = {
  //items: PropTypes.array.isRequired,
};

export default StatisticsSection;
