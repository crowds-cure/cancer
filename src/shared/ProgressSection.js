import { Component } from 'react';
import React from 'react';
import ProgressBar from './ProgressBar.js';
import './ProgressSection.css';
import medal from '../images/medal.svg';

class ProgressSection extends Component {
  render() {
    const low = 200;
    const high = 300;
    const current = 275;

    return (
      <div className="ProgressSection">
        <div>
          <div className="numberCases">
            <div className="medalContainer">
              <div className="medalBackground">
                <img src={medal} className="medal" alt="medal" />
              </div>
            </div>
            <div className="currentPoints">
              <span className="value">{current}</span>
              <span className="suffix">cases</span>
              <span className="plusPoints">+30</span>
            </div>
          </div>
          <div className="progressBarContainer">
            <span className="progressLow">{low}</span>
            <span className="progressHigh">{high}</span>
            <ProgressBar min={low} max={high} current={current} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProgressSection;
