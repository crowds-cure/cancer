import { Component } from 'react';
import React from 'react';
import RankingItem from './RankingItem.js';
import './RankingSection.css';
import PropTypes from 'prop-types';
import getTopAnnotators from './getTopAnnotators';

class RankingSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topAnnotators: [{}, {}, {}]
    };

    getTopAnnotators().then(topAnnotators => {
      this.setState({
        topAnnotators
      });
    });
  }

  render() {
    const rankingItems = this.state.topAnnotators;

    const items = rankingItems.map((item, index) => (
      <RankingItem key={index} number={item.value} text={item.name} />
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
