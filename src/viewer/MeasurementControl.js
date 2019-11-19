import { Component } from 'react';
import React from 'react';
import './MeasurementControl.css';
import PropTypes from 'prop-types';

class MeasurementControl extends Component {
  render() {
    return (
      <div className="MeasurementControl noselect">
        <div className={this.props.disabled ? 'controls disabled' : 'controls'}>
          <span
            className="previous arrow-container"
            onClick={this.props.previous}
          >
            <span className="left-arrow arrow" />
          </span>
          <span className="number">{this.props.number}</span>
          <span className="next arrow-container" onClick={this.props.next}>
            <span className="right-arrow arrow" />
          </span>
          <span className="label">Label</span>
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
