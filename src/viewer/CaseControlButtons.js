import { Component } from 'react';
import React from 'react';

class CaseControlButtons extends Component {
  render() {
    return (
      <div className="CaseControlButtons">
        <button type="button">Case Feedback</button>
        <div>
          <button type="button">Skip</button>
          <button type="button">Save</button>
        </div>
        <div>28 Cases</div>
        <button type="button">End Session</button>
      </div>
    );
  }
}

export default CaseControlButtons;
