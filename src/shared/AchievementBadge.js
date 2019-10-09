import { Component } from 'react';
import React from 'react';
import './AchievementBadge.css';

class AchievementBadge extends Component {
  static defaultProps = {
    className: ''
  };

  render() {
    return (
      <div className={`AchievementBadge noselect ${this.props.className}`}>
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
