import { Component } from 'react';
import React from 'react';
import './RankBadge.css';

class RankBadge extends Component {
  render() {
    return (
      <div className="rankBadge">
        <img
          src={this.props.img}
          alt={this.props.name}
          data-tip={this.props.description}
          onClick={this.props.onClick}
        />
      </div>
    );
  }
}

export default RankBadge;
