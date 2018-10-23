import { Component } from 'react';
import React from 'react';
import ToolbarButton from './ToolbarButton.js';
import './ToolbarSection.css';

class ToolbarSection extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }
  render() {
    const items = this.props.buttons.map((item, index) => {
      return <ToolbarButton key={index} {...item} click={this.onClick} />;
    });

    return <div className="ToolbarSection">{items}</div>;
  }

  onClick(id) {
    const buttonItem = this.props.buttons.find(item => item.command === id);

    if (buttonItem.type === 'tool') {
      this.props.setToolActive(buttonItem.command);
    }
  }
}

export default ToolbarSection;
