import { Component } from 'react';
import React from 'react';

class InputRadio extends Component {
  render() {
    const labelClass = this.props.labelClass;
    //" tree-current-node " +
    return (
      <label
        className={'wrapperLabel radioLabel ' + labelClass}
        name="label"
        onClick={this.props.click}
      >
        <input
          type="radio"
          className={this.props.className}
          value={this.props.value}
        />
        <span className="wrapperText">{this.props.label}</span>
      </label>
    );
  }
}

export default InputRadio;
