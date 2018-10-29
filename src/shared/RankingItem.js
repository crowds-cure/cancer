import { Component } from 'react';
import React from 'react';
import './RankingItem.css';
import PropTypes from 'prop-types';

class RankingItem extends Component {
  render() {
    return (
      <li className="RankingItem">
        <span className="number">{this.props.number}</span>
        <span className="text">{this.props.text}</span>
      </li>
    );
  }
}

RankingItem.propTypes = {
  number: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired
};

export default RankingItem;
