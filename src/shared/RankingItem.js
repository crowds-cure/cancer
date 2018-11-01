import { Component } from 'react';
import React from 'react';
import './RankingItem.css';
import PropTypes from 'prop-types';

class RankingItem extends Component {
  render() {
    const number = this.props.number === undefined ? '---' : this.props.number;
    const text = this.props.text === undefined ? 'Loading...' : this.props.text;

    return (
      <li className="RankingItem">
        <span className="number">{number}</span>
        <span className="text">{text}</span>
      </li>
    );
  }
}

RankingItem.propTypes = {
  number: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired
};

export default RankingItem;
