import { Component } from 'react';
import React from 'react';
import medal from '../images/medal.svg';
import './Medal.css';

class Medal extends Component {
  render() {
    const medalClassSize = `medal-bg-${this.props.size}`;

    return (
      <div className={medalClassSize} title={this.props.type}>
        <img src={medal} className="medal" alt="medal" />
      </div>
    );
  }
}

export default Medal;
