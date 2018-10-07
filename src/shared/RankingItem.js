import { Component } from 'react';
import React from 'react';
import './RankingItem.css';

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

export default RankingItem;
