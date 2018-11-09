import { Component } from 'react';
import React from 'react';
import medal from '../images/medal.svg';
import './Medal.css';

class Medal extends Component {
  render() {
    return (
      <div className="medal-bg" title={this.props.type}>
        <img src={medal} className="medal" alt="medal" />
      </div>
    );
  }
}

export default Medal;
