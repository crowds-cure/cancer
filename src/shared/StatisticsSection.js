import { Component } from 'react';
import React from 'react';
import StatisticsCard from './StatisticsCard.js';
import './StatisticsSection.css';
//import PropTypes from 'prop-types';

class StatisticsSection extends Component {
  render() {
    const stats = [
      {
        number: 26,
        description: 'Minutes average session time'
      }
    ];

    const items = stats.map((item, index) => (
      <StatisticsCard key={index} {...item} />
    ));

    return (
      <div className="StatisticsSection">
        <span className="subTitle">Community stats</span>
        {items}
      </div>
    );
  }
}

StatisticsSection.propTypes = {
  //items: PropTypes.array.isRequired,
};

export default StatisticsSection;
