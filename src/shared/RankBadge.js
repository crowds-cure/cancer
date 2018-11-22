import { Component } from 'react';
import React from 'react';
import './RankBadge.css';

class RankBadge extends Component {
  render() {
    return (
      <div className="rankBadge" title={this.props.name}>
        <img
          src={this.props.img}
          alt={this.props.name}
          onClick={this.props.onClick}
        />
      </div>
    );
  }
}

export default RankBadge;
