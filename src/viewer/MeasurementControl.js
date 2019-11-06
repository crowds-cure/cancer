import { Component } from 'react';
import React from 'react';
import './MeasurementControl.css';
import PropTypes from 'prop-types';

class MeasurementControl extends Component {
  getControlClassName(props) {
    let className = 'MeasurementControl noselect';
    if (props.disabled) {
      className += ' disabled';
    }

    return className;
  }

  getMagnifyClassName(props) {
    let className = 'magnify';
    if (props.magnificationActive) {
      className += ' active';
    }

    return className;
  }

  getNumber(number) {
    return number || '';
  }

  render() {
    return (
      <div className={this.getControlClassName(this.props)}>
        <div className="controls">
          <span
            className="previous arrow-container"
            onClick={this.props.previous}
          >
            <span className="left-arrow arrow" />
          </span>
          <span className="number">{this.getNumber(this.props.number)}</span>
          <span className="next arrow-container" onClick={this.props.next}>
            <span className="right-arrow arrow" />
          </span>
        </div>
        <div className="label" onClick={this.props.onLabelClick}>
          Label
        </div>
        <div
          className={this.getMagnifyClassName(this.props)}
          onClick={this.props.onMagnifyClick}
        >
          Magnify
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
