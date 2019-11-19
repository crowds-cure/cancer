import { Component } from 'react';
import React from 'react';
import './StatisticsCard.css';
import PropTypes from 'prop-types';

class StatisticsCard extends Component {
  render() {
    // TODO: [layout] Format number with commas (for greater than 1000)
    const number = this.props.number === undefined ? '---' : this.props.number;

    return (
      <div className="StatisticsCard">
        <span className="number">{number}</span>
        <span className="description">{this.props.description}</span>
      </div>
    );
  }
}

StatisticsCard.propTypes = {
  number: PropTypes.number,
  description: PropTypes.string.isRequired
};

export default StatisticsCard;
