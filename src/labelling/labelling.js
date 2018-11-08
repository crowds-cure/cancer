import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import SelectTree from '../select-tree/SelectTree.js';
import { labelItems } from './labellingData.js';

import './labelling.css';

class Labelling extends Component {
  static defaultProps = {
    selectTreeTitle: 'Add Label',
    measurementData: {},
    eventData: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      location: null,
      description: null,
      justCreated: true
    };
  }

  render() {
    let showButtons = false;
    let showSelectTree = false;

    if (!this.state.justCreated) {
      if (this.state.location === null) {
        showSelectTree = true;
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
      <div
        className="labellingComponent"
        style={initialStyle}
        onMouseLeave={this.props.labellingDoneCallback}
      >
        {this.state.justCreated && (
          <button className="addLabelButton" onClick={this.showLabelling}>
            Add Label
          </button>
        )}
        {showSelectTree && (
          <SelectTree
            items={labelItems}
            selectTreeTitle={this.props.selectTreeTitle}
            onSelected={this.relabelCalback}
          />
        )}
        {showButtons && (
          <>
            <div className="textArea">
              {this.state.location && this.state.location.label}
              {this.state.description && ` (${this.state.description.label})`}
            </div>
            <div className="commonButtons">
              <button className="commonButton" onClick={this.relabel}>
                Relabel
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

  relabel = () => {
    this.setState({
      location: null,
      description: null
    });
  };

  relabelCalback = (event, location, description) => {
    const descriptionText = description ? ` (${description.label})` : '';
    const textLine = location.label + descriptionText;

    this.props.measurementData.location = location.label;
    if (description) {
      this.props.measurementData.description = description.label;
    }
    this.props.measurementData.additionalData = [textLine];
    this.setState({
      location: location,
      description: description
    });
  };
}

Labelling.propTypes = {
  eventData: PropTypes.object.isRequired,
  measurementData: PropTypes.object.isRequired,
  labellingDoneCallback: PropTypes.func.isRequired
};

export default Labelling;
