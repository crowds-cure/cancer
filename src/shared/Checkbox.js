import { Component } from 'react';
import React from 'react';
import './Checkbox.css';
import PropTypes from 'prop-types';

class Checkbox extends Component {
  render() {
    return (
      <label className="Checkbox" htmlFor={this.props.id}>
        {this.props.label}
        <input
          type="checkbox"
          id={this.props.id || this.props.value}
          value={this.props.value}
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        <div className="control-indicator" />
      </label>
    );
  }
}

Checkbox.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired
};

export default Checkbox;
