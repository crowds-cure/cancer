import { Component } from 'react';
import React from 'react';
import ToolbarButton from './ToolbarButton.js';
import './ToolbarSection.css';
import * as cornerstone from 'cornerstone-core';
import viewerCommands from '../lib/viewerCommands.js';
import PropTypes from 'prop-types';

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

    const elements = cornerstone.getEnabledElements();
    if (!elements || !elements.length) {
      return;
    }

    const activeElement = elements[0].element;

    if (buttonItem.type === 'tool') {
      this.props.setToolActive(buttonItem.command);
    } else {
      viewerCommands[buttonItem.command](activeElement);
    }
  }
}

ToolbarSection.propTypes = {
  buttons: PropTypes.array.isRequired,
  setToolActive: PropTypes.func.isRequired
};

export default ToolbarSection;
