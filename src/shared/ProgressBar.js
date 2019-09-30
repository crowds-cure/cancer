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
      value: this.props.value - this.props.min,
      max: this.props.max - this.props.min
    };

    this.progressBarRef = React.createRef();
    this.progressGlowRef = React.createRef();
  }

  render() {
    return (
      <div className="ProgressBarWrapper">
        {this.props.startNumber === undefined ? (
          ''
        ) : (
          <div className="startNumber">{this.props.startNumber}</div>
        )}
        <progress
          className="ProgressBar"
          max={this.state.max}
          value={this.state.value}
          ref={this.progressBarRef}
        />
        <progress
          className="ProgressBar ProgressGlow"
          max={this.state.max}
          value={this.state.value}
          ref={this.progressGlowRef}
        />
        {this.props.endNumber === undefined ? (
          ''
        ) : (
          <div className="endNumber">{this.props.endNumber}</div>
        )}
      </div>
    );
  }

  componentDidUpdate = previousProps => {
    const progressBarElement = this.progressBarRef.current;
    const progressGlowElement = this.progressGlowRef.current;

    const oldValue = this.state.value;
    const newValue = this.props.value - this.props.min;

    const oldMax = this.state.max;
    const newMax = this.props.max - this.props.min;

    if (oldMax !== newMax) {
      progressBarElement.classList.add('notransition');
      progressGlowElement.classList.add('notransition');

      this.setState({
        max: newMax,
        value: newValue
      });
    } else if (newValue !== oldValue) {
      progressBarElement.classList.remove('notransition');
      progressGlowElement.classList.remove('notransition');
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
