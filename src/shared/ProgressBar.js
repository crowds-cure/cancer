import { Component } from 'react';
import React from 'react';
import './ProgressBar.css';
import PropTypes from 'prop-types';

class ProgressBar extends Component {
  constructor(props) {
    super(props);

    if (this.props.value === undefined) {
      this.props.value = this.props.min;
    }

    this.state = {
      min: this.props.min,
      max: this.props.max,
      value: this.props.value
    };

    this.progressBarRef = React.createRef();
  }

  getProgressValueStyle(state) {
    const baseValue = state.value - state.min;
    const baseMax = state.max - state.min;
    const percentage = (baseValue / baseMax) * 100;
    return {
      width: `${percentage}%`
    };
  }

  render() {
    return (
      <div className="ProgressBarWrapper">
        {this.props.startNumber === undefined ? (
          ''
        ) : (
          <div className="startNumber">{this.props.startNumber}</div>
        )}
        <div className="ProgressBar" ref={this.progressBarRef}>
          <div
            className="ProgressValue"
            style={this.getProgressValueStyle(this.state)}
          />
          <div
            className="ProgressGlow"
            style={this.getProgressValueStyle(this.state)}
          />
        </div>
        {this.props.endNumber === undefined ? (
          ''
        ) : (
          <div className="endNumber">{this.props.endNumber}</div>
        )}
      </div>
    );
  }

  componentDidUpdate = () => {
    const progressBarElement = this.progressBarRef.current;

    const oldValue = this.state.value;
    const newValue = this.props.value;

    const oldMax = this.state.max;
    const newMax = this.props.max;

    if (oldMax !== newMax) {
      progressBarElement.classList.add('valueReset');

      this.setState({
        min: this.props.min,
        max: newMax,
        value: newValue
      });
    } else if (newValue !== oldValue) {
      progressBarElement.classList.remove('valueReset');
      this.setState({ value: newValue });
    }
  };
}

ProgressBar.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired
};

export default ProgressBar;
