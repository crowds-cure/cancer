import { Component } from 'react';
import React from 'react';
import './SimpleHeaderSection.css';

class SimpleHeaderSection extends Component {
  render() {
    return (
      <div className="simpleHeader">
        <div className="logo">
          <span className="logoText highlight">Crowds </span>
          <span className="logoText">Cure Cancer</span>
        </div>
      </div>
    );
  }
}

export default SimpleHeaderSection;
