import { Component } from 'react';
import React from 'react';
import { BADGE_TYPES } from '../badges.js';

const style = {
  height: '100%',
  display: 'flex',
  alignItems: 'left',
  justifyContent: 'left',
  textAlign: 'center',
  color: 'black',
  background: 'white',
  border: 'none',
  overflow: 'hidden'
};

class AchievementBadge extends Component {
  render() {
    const badge = BADGE_TYPES[this.props.type];

    return (
      <div style={style} className="AchievementBadge">
        <h1>{badge.name}</h1>
        {/*<p>{this.props.description}</p>*/}
        {/*<img src={{this.props.img}}></img>*/}
      </div>
    );
  }
}

export default AchievementBadge;
