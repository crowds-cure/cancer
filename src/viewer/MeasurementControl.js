import { Component } from 'react';
import React from 'react';
import './MeasurementControl.css';
import PropTypes from 'prop-types';

class MeasurementControl extends Component {
  render() {
    return (
      <div className="MeasurementControl">
        <button className="previous" onClick={this.props.previous}>
          Previous
        </button>
        <span className="number">{this.props.number}</span>
        <button className="next" onClick={this.props.next}>
          Next
        </button>
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
