import { Component } from 'react';
import React from 'react';
import RankingItem from './RankingItem.js';
import './RankingSection.css';
import PropTypes from 'prop-types';

class RankingSection extends Component {
  render() {
    const rankingItems = [
      {
        number: 250,
        text: 'misty_mandrill'
      },
      {
        number: 200,
        text: 'shadowy_bee'
      },
      {
        number: 200,
        text: 'scary_porcupine'
      }
    ];

    const items = rankingItems.map((item, index) => (
      <RankingItem key={index} number={item.number} text={item.text} />
    ));

    return (
      <div className="RankingSection">
        <span className="title">{this.props.name}</span>
        <ul className="list">{items}</ul>
      </div>
    );
  }
}

RankingSection.propTypes = {
  name: PropTypes.string.isRequired
};

export default RankingSection;
