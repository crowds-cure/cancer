import { Component } from 'react';
import React from 'react';
import './MeasurementControl.css';
import PropTypes from 'prop-types';

class MeasurementControl extends Component {
  render() {
    return (
      <div className="MeasurementControl">
        <div className="controls">
          <span className="previous" onClick={this.props.previous}>
            <span className="left-arrow" />
          </span>
          <span className="number">{this.props.number}</span>
          <span className="next" onClick={this.props.next}>
            <span className="right-arrow" />
          </span>
        </div>
        <div className="lesions">lesions</div>
      </div>
    );
  }
}

MeasurementControl.propTypes = {
  number: PropTypes.number.isRequired,
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired
};

export default MeasurementControl;
