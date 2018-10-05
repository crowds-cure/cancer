import { Component } from 'react';
import React from 'react';
import ProgressBar from './ProgressBar.js';

class ProgressSection extends Component {
  render() {
    const low = 200;
    const high = 300;
    const current = 275;

    return (
      <div className="ProgressSection">
        <h1>Your activity</h1>
        <ProgressBar min={low} max={high} current={current} />
        <h2>{current}</h2>
        <h3>cases</h3>
      </div>
    );
  }
}

export default ProgressSection;
