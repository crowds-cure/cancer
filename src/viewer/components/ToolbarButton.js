import { Component } from 'react';
import React from 'react';
import './ToolbarButton.css';
import PropTypes from 'prop-types';

class ToolbarButton extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    return (
      <div
        className={this.props.active ? 'ToolbarButton active' : 'ToolbarButton'}
        onClick={this.onClick}
      >
        <svg>
          <use xlinkHref={this.props.svgUrl} />
        </svg>
        <span>{this.props.text}</span>
      </div>
    );
  }

  onClick(event) {
    const id = this.props.command;
    this.props.click(id);
  }
}

ToolbarButton.propTypes = {
  text: PropTypes.string.isRequired,
  svgUrl: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default ToolbarButton;
