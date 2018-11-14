import { Component } from 'react';
import React from 'react';
import './AchievementBadge.css';

// TODO
// Add flag to show as grayed out e.g. for badges you haven't reached yet
class AchievementBadge extends Component {
  render() {
    const img = `${this.props.img}#Page-1`;

    return (
      <div className="AchievementBadge">
        <svg viewBox="0 0 45 44">
          <use xlinkHref={img} />
        </svg>
      </div>
    );
  }
}

export default AchievementBadge;
