import { Component } from 'react';
import React from 'react';
import './ToolbarButton.css';

class ToolbarButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    };

    this.onClick = this.onClick.bind(this);
  }

  render() {
    const command = this.props.command || null;

    // TODO: Hook up to actual function
    return (
      <div
        className={this.state.active ? 'ToolbarButton active' : 'ToolbarButton'}
        data-command={command}
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
    console.log('clicked');
  }
}

export default ToolbarButton;
