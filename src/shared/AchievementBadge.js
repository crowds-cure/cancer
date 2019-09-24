import { Component } from 'react';
import React from 'react';
import './AchievementBadge.css';

class AchievementBadge extends Component {
  render() {
    return (
      <div className="AchievementBadge noselect">
        <img
          src={this.props.img}
          alt={this.props.description}
          data-tip={this.props.description}
        />
      </div>
    );
  }
}

export default AchievementBadge;
