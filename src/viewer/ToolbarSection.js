import { Component } from 'react';
import React from 'react';
import ToolbarButton from './ToolbarButton.js';
import './ToolbarSection.css';

class ToolbarSection extends Component {
  render() {
    const buttons = [
      {
        command: 'pan',
        text: 'Pan',
        svgUrl: '/icons.svg#icon-tools-pan'
      },
      {
        command: 'wwwc',
        text: 'Levels',
        svgUrl: '/icons.svg#icon-tools-levels'
      },
      {
        command: 'zoom',
        text: 'Zoom',
        svgUrl: '/icons.svg#icon-tools-zoom'
      },
      {
        command: 'length',
        text: 'Length',
        svgUrl: '/icons.svg#icon-tools-measure-temp'
      },
      {
        command: 'stackScroll',
        text: 'Stack Scroll',
        svgUrl: '/icons.svg#icon-tools-stack-scroll'
      },
      {
        command: 'clearAll',
        text: 'Clear',
        svgUrl: '/icons.svg#icon-tools-reset'
      }
    ];

    const items = buttons.map((item, index) => {
      return (
        <ToolbarButton
          key={index}
          text={item.text}
          svgUrl={item.svgUrl}
          command={item.command}
        />
      );
    });

    return <div className="ToolbarSection">{items}</div>;
  }
}

export default ToolbarSection;
