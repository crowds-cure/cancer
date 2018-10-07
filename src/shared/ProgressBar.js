import { Component } from 'react';
import React from 'react';
import './ProgressBar.css';

class ProgressBar extends Component {
  render() {
    const value = 0.6;

    return <progress className="ProgressBar" value={value} />;
  }
}

export default ProgressBar;
