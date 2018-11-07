import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import SelectTree from '../select-tree/SelectTree.js';
import { labelItems, descriptionItems } from './labellingData.js';

import './labelling.css';

class Labelling extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: null,
      description: null,
      requestDescription: false,
      justCreated: true
    };
  }

  static defaultProps = {
    eventData: {},
    measurementData: {}
  };

  render() {
    let showButtons = false;
    let selectTreeItems = null;
    let selectTreeCalback;
    let selectTreeTitle = '';

    if (!this.state.justCreated) {
      if (this.state.label === null) {
        selectTreeItems = labelItems;
        selectTreeTitle = 'Assign Label';
        selectTreeCalback = this.itemLabelSelected;
      } else if (this.state.requestDescription) {
        selectTreeItems = descriptionItems;
        selectTreeTitle = 'Assign Description';
        selectTreeCalback = this.itemDescriptionSelected;
      } else {
        showButtons = true;
      }
    }

    const { eventData } = this.props;

    // Hardcoding displacement to the right for now
    const initialStyle = {
      left: `${eventData.currentPoints.canvas.x + 50}px`,
      top: `${eventData.currentPoints.canvas.y}px`
    };

    return (
      <div className="labellingComponent" style={initialStyle}>
        {this.state.justCreated && (
          <button className="addLabelButton" onClick={this.showLabelling}>
            Add Label
          </button>
        )}
        {selectTreeItems && (
          <SelectTree
            title={selectTreeTitle}
            items={selectTreeItems}
            onSelect={selectTreeCalback}
          />
        )}
        {showButtons && (
          <>
            <div className="textArea">
              {this.state.label && this.state.label.label}
              {this.state.description && ` (${this.state.description.label})`}
            </div>
            <div className="commonButtons">
              <button className="commonButton" onClick={this.relabel}>
                Relabel
              </button>
              <button className="commonButton" onClick={this.editDescription}>
                {this.state.description ? 'Edit ' : 'Add '} description
              </button>
              <button
                className="commonButton"
                onClick={this.props.labellingDoneCallback}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  showLabelling = () => {
    this.setState({
      justCreated: false
    });
  };

  itemLabelSelected = (event, item) => {
    const textLine =
      item.label +
      (this.state.description ? ` (${this.state.description.label})` : '');

    this.props.measurementData.location = item.label;
    this.props.measurementData.additionalData = [textLine];
    this.setState({
      label: item
    });
  };

  itemDescriptionSelected = (event, item) => {
    const textLine =
      this.state.label.label + (item.label ? ` (${item.label})` : '');

    this.props.measurementData.description = item.description;
    this.props.measurementData.additionalData = [textLine];
    this.setState({
      description: item,
      requestDescription: false
    });
  };

  relabel = () => {
    this.setState({
      label: null
    });
  };

  editDescription = () => {
    this.setState({
      description: null,
      requestDescription: true
    });
  };
}

Labelling.propTypes = {
  eventData: PropTypes.object.isRequired,
  measurementData: PropTypes.object.isRequired,
  labellingDoneCallback: PropTypes.func.isRequired
};

export default Labelling;
