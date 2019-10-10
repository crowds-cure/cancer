import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

import './AchievementDetails.css';

import AchievementBadge from './AchievementBadge.js';

class AchievementDetails extends Component {
  getBadge(id, achievement) {
    const { description, completed, img } = achievement;
    const className = completed ? 'active' : 'inactive';
    return (
      <AchievementBadge
        key={id}
        className={className}
        img={img}
        description={description}
      />
    );
  }

  render() {
    const { id, achievement } = this.props;
    const compactBadgeElement = this.getBadge(id, achievement);
    const { description, completed } = achievement;
    const className = completed ? 'active' : 'inactive';

    // TODO: [layout] Define title, dateEarned, currentValue and maxValue
    const title = 'Badge title';
    const dateEarned = 'Earned 9 Aug, 2018 - 7:22 PM';
    let hasProgress = false;
    let currentValue;
    let maxValue;

    if (id === 'timeSessionWeek90m') {
      hasProgress = true;
      currentValue = 68;
      maxValue = 90;
    } else if (id === 'day50Measurements') {
      hasProgress = true;
      currentValue = 16;
      maxValue = 50;
    }

    const progressPercent = (currentValue / maxValue) * 100;
    const currentClass = progressPercent <= 50 ? 'after' : '';
    const currentStyle = {
      width: `${progressPercent}%`
    };

    return (
      <div key={id} className={`AchievementDetails ${className}`}>
        {compactBadgeElement}
        <div className="info">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
          {hasProgress ? (
            <div className="progress">
              <div className={`current ${currentClass}`} style={currentStyle}>
                <span className="value">
                  {currentValue}/{maxValue}
                </span>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="date">{dateEarned}</div>
      </div>
    );
  }
}

AchievementDetails.propTypes = {
  id: PropTypes.string.isRequired,
  achievement: PropTypes.object.isRequired
};

export default AchievementDetails;
