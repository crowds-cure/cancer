import { Component } from 'react';
import React from 'react';
import './StatisticsCard.css';
import PropTypes from 'prop-types';

class StatisticsCard extends Component {
  render() {
    return (
      <div className="StatisticsCard">
        <span className="number">{this.props.number}</span>
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
