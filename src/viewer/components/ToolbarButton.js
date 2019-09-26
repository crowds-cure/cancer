import { Component } from 'react';
import React from 'react';
import './ToolbarButton.css';
import PropTypes from 'prop-types';

class ToolbarButton extends Component {
  render() {
    const baseClass = 'ToolbarButton noselect';
    return (
      <div
        className={this.props.active ? `${baseClass} active` : baseClass}
        onClick={this.onClick}
      >
        <svg>
          <use xlinkHref={this.props.svgUrl} />
        </svg>
        <span>{this.props.text}</span>
      </div>
    );
  }

  onClick = event => {
    const id = this.props.command;
    this.props.click(id);
  };
}

ToolbarButton.propTypes = {
  text: PropTypes.string.isRequired,
  svgUrl: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default ToolbarButton;
