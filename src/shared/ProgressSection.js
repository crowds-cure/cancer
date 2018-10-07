import { Component } from 'react';
import React from 'react';
import ProgressBar from './ProgressBar.js';
import './ProgressSection.css';

class ProgressSection extends Component {
  render() {
    const low = 200;
    const high = 300;
    const current = 275;

    return (
      <div className="ProgressSection">
        <span className="title">Your activity</span>
        <ProgressBar min={low} max={high} current={current} />
        <span className="value">{current}</span>
        <span className="suffix">cases</span>
      </div>
    );
  }
}

export default ProgressSection;
