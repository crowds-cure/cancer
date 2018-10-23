import { Component } from 'react';
import React from 'react';
import './ToolbarButton.css';

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

export default ToolbarButton;
