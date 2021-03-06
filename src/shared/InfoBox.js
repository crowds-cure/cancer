import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import './InfoBox.css';

class InfoBox extends Component {
  render() {
    return (
      <div className={`InfoBox ${this.props.className}`}>
        <div className="boxHeader">{this.props.headerText}</div>
        <div className="boxContent">{this.props.children}</div>
      </div>
    );
  }
}

InfoBox.propTypes = {
  className: PropTypes.string.isRequired,
  headerText: PropTypes.string.isRequired
};

export default InfoBox;
