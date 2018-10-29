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
      <div className={colClass}>
        <StatisticsCard key={index} {...item} />
      </div>
    ));

    return (
      <div className="StatisticsSection">
        <span className="subTitle">Community stats</span>
        <div className="row">{items}</div>
      </div>
    );
  }
}

StatisticsSection.propTypes = {
  //items: PropTypes.array.isRequired,
};

export default StatisticsSection;
