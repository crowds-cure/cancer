import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import SelectTree from '../select-tree/SelectTree.js';
import { labelItems } from './labellingData.js';
import { CSSTransition } from 'react-transition-group';

import './labelling.css';

class Labelling extends Component {
  static defaultProps = {
    selectTreeFirstTitle: 'Add Label',
    selectTreeSecondTitle: 'Add Optional Description',
    measurementData: {},
    eventData: {},
    skipButton: false
  };

  constructor(props) {
    super(props);

    this.state = {
      displayComponent: true,
      location: null,
      description: null,
      justCreated: true
    };
  }

  render() {
    let showAddLabel = this.state.justCreated && !this.props.skipButton;
    let showButtons = false;
    let showSelectTree = false;

    if (!showAddLabel) {
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
      <CSSTransition
        in={this.state.displayComponent}
        appear={true}
        timeout={500}
        classNames="labelling"
        onExited={() => {
          this.props.labellingDoneCallback();
        }}
      >
        <div
          className="labellingComponent"
          style={initialStyle}
          onMouseLeave={this.fadeOutAndLeave}
        >
          {showAddLabel && (
            <button className="addLabelButton" onClick={this.showLabelling}>
              Add Label
            </button>
          )}
          {showSelectTree && (
            <SelectTree
              items={labelItems}
              onSelected={this.relabelCalback}
              selectTreeFirstTitle={this.props.selectTreeFirstTitle}
              selectTreeSecondTitle={this.props.selectTreeSecondTitle}
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
              </div>
            </>
          )}
        </div>
      </CSSTransition>
    );
  }

  fadeOutAndLeave = () => {
    this.setState({
      displayComponent: false
    });
  };

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

  relabelCalback = (event, location, description, stillSelecting) => {
    const descriptionText = description ? ` (${description.label})` : '';
    const textLine = location.label + descriptionText;

    this.props.measurementData.location = location.label;
    if (description) {
      this.props.measurementData.description = description.label;
    }
    this.props.measurementData.additionalData = [textLine];

    if (!stillSelecting) {
      this.setState({
        location: location,
        description: description
      });
    }
  };
}

Labelling.propTypes = {
  eventData: PropTypes.object.isRequired,
  measurementData: PropTypes.object.isRequired,
  labellingDoneCallback: PropTypes.func.isRequired
};

export default Labelling;
