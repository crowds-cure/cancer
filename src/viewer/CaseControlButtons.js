import { Component } from 'react';
import React from 'react';
import './CaseControlButtons.css';

class CaseControlButtons extends Component {
  render() {
    return (
      <div className="CaseControlButtons">
        <button type="button">Case Feedback</button>
        <div className="btn-group">
          <button type="button">Skip</button>
          <button type="button">Save</button>
        </div>
        <span>28 Cases</span>
        <button type="button">End Session</button>
      </div>
    );
  }
}

export default CaseControlButtons;
