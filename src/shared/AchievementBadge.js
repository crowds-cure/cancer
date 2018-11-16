import { Component } from 'react';
import React from 'react';
import './AchievementBadge.css';

class AchievementBadge extends Component {
  render() {
    return (
      <div className="AchievementBadge">
        <img src={this.props.img} data-tip={this.props.description} />
      </div>
    );
  }
}

export default AchievementBadge;
