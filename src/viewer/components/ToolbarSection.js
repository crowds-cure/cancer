import { Component } from 'react';
import React from 'react';
import ToolbarButton from './ToolbarButton.js';
import './ToolbarSection.css';
import * as cornerstone from 'cornerstone-core';
import viewerCommands from '../lib/viewerCommands.js';
import PropTypes from 'prop-types';

const wLPresetIDs = [
  'setWLPresetSoftTissue',
  'setWLPresetLung',
  'setWLPresetLiver',
  'setWLPresetBrain'
];

class ToolbarSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      presetSelected: null
    };
  }
  render() {
    const items = this.props.buttons.map((item, index) => {
      return <ToolbarButton key={index} {...item} click={this.onClick} />;
    });

    const wlPresetItems = this.props.buttons.map((item, index) => {
      if (wLPresetIDs.includes(item.command)) {
        return <ToolbarButton key={index} {...item} click={this.onClick} />;
      }
      return '';
    });

    const toolItems = this.props.buttons.map((item, index) => {
      if (!wLPresetIDs.includes(item.command)) {
        return <ToolbarButton key={index} {...item} click={this.onClick} />;
      }
      return '';
    });

    const presetSelectedButton = this.props.buttons.find(item => {
      return item.command === this.state.presetSelected;
    });

    return (
      <div className="ToolbarSection">
        <div className="wlPresets">
          {wlPresetItems}
          <span className="presetSelected">
            <span>LEVELS: </span>
            <span>
              {presetSelectedButton ? presetSelectedButton.text : 'Manual'}
            </span>
          </span>
        </div>
        <div className="tools">{toolItems}</div>
      </div>
    );
  }

  onClick = id => {
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
      this.setState({
        presetSelected: id
      });
    }
  };
}

ToolbarSection.propTypes = {
  buttons: PropTypes.array.isRequired,
  setToolActive: PropTypes.func.isRequired
};

export default ToolbarSection;
