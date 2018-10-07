import { Component } from 'react';
import React from 'react';
import './ToolbarButton.css';

class ToolbarButton extends Component {
  render() {
    const command = this.props.command || null;

    // TODO: Hook up to actual function
    return (
      <div className="ToolbarButton" data-command={command}>
        <svg>
          <use xlinkHref={this.props.svgUrl} />
        </svg>
        <span>{this.props.text}</span>
      </div>
    );
  }
}

export default ToolbarButton;
