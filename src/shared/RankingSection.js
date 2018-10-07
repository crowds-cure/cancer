import { Component } from 'react';
import React from 'react';
import RankingItem from './RankingItem.js';
import './RankingSection.css';

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

export default RankingSection;
