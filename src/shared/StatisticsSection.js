import { Component } from 'react';
import React from 'react';
import StatisticsCard from './StatisticsCard.js';
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

    const stats = [
      {
        number: communityStats.totalMeasurements,
        description: 'Total Measurements'
      },
      {
        number: 26,
        description: 'Minutes average session time'
      },
      {
        number: 26,
        description: 'Minutes average session time'
      },
      {
        number: 26,
        description: 'Minutes average session time'
      },
      {
        number: 26,
        description: 'Minutes average session time'
      },
      {
        number: 26,
        description: 'Minutes average session time'
      }
    ];
    const colClass = this.props.col ? `col-${this.props.col}` : 'col';

    const items = stats.map((item, index) => (
      <div key={index} className={colClass}>
        <StatisticsCard {...item} />
      </div>
    ));

    return (
      <div className="StatisticsSection">
        <div className="subTitle">Community stats</div>
        <div className="row">{items}</div>
      </div>
    );
  }
}

StatisticsSection.propTypes = {
  //items: PropTypes.array.isRequired,
};

export default StatisticsSection;
