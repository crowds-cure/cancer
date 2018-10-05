import { Component } from 'react';
import React from 'react';
import ToolbarButton from './ToolbarButton.js';

class ToolbarSection extends Component {
  render() {
    const buttons = [
      {
        name: 'pan'
      },
      {
        name: 'wwwc'
      },
      {
        name: 'length'
      },
      {
        name: 'stackScroll'
      }
    ];

    const items = buttons.map((item, index) => <ToolbarButton key={index} />);

    return <div className="ToolbarSection">{items}</div>;
  }
}

export default ToolbarSection;
