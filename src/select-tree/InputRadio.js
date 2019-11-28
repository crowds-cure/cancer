import { Component } from 'react';
import React from 'react';

class InputRadio extends Component {
  render() {
    const labelClass = this.props.labelClass;
    return (
      <label
        className={'wrapperLabel radioLabel ' + labelClass}
        htmlFor={this.props.id}
      >
        <input
          type="radio"
          id={this.props.id}
          className={this.props.className + ' radioInput'}
          value={this.props.value}
          onChange={this.onSelected}
        />
        <span className="wrapperText">{this.props.label}</span>
      </label>
    );
  }

  onSelected = evt => {
    if (this.props.onSelected) {
      this.props.onSelected(evt, this.props.itemData);
    }
  };
}

export default InputRadio;
