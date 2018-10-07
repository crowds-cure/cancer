import { Component } from 'react';
import React from 'react';

class LoadingIndicator extends Component {
  render() {
    return (
      <div className="LoadingIndicator">
        <svg>
          <use xlinkHref="/imgs/icons.svg#icon-spinner" />
        </svg>
      </div>
    );
  }
}

export default LoadingIndicator;
