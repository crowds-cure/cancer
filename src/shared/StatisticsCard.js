import { Component } from 'react';
import React from 'react';
import './StatisticsCard.css';

class StatisticsCard extends Component {
  render() {
    const number = this.props.number || 25;
    const description =
      this.props.description || 'Minutes average session time';

    return (
      <div className="StatisticsCard">
        <span className="number">{number}</span>
        <span className="description">{description}</span>
      </div>
    );
  }
}

export default StatisticsCard;
