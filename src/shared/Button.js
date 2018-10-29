import { Component } from 'react';
import React from 'react';
import './Button.css';
import PropTypes from 'prop-types';

class Button extends Component {
  render() {
    return (
      <button className="btn btn-default noselect" onClick={this.props.click}>
        {this.props.label}
      </button>
    );
  }
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired
};

export default Button;
