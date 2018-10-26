import { Component } from 'react';
import React from 'react';
import './LoadingIndicator.css';

class LoadingIndicator extends Component {
  render() {
    return (
      <div className="LoadingIndicator">
        <div className="indicatorContents">
          <span>Loading...</span>
          <svg>
            <use xlinkHref="/icons.svg#icon-spinner" />
          </svg>
        </div>
      </div>
    );
  }
}

export default LoadingIndicator;
