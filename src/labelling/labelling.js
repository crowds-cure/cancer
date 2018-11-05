import { Component } from 'react';
import React from 'react';

import SelectTree from '../select-tree/SelectTree.js';
import { labelItems, descriptionItems } from './labellingData.js';

import './labelling.css';

class Labelling extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: null,
      description: null,
      requestDescription: false
    };
  }

  render() {
    let showButtons = false;
    let buttons = '';
    let listOfItems = null;
    let onSelectedCallback;

    if (this.state.label === null) {
      listOfItems = labelItems;
      onSelectedCallback = this.itemLabelSelected;
    } else if (this.state.requestDescription) {
      listOfItems = descriptionItems;
      onSelectedCallback = this.itemDescriptionSelected;
    } else {
      showButtons = true;
    }

    if (showButtons) {
      buttons = (
        <>
          <button onClick={this.relabel}>Relabel</button>
          <button onClick={this.editDescription}>
            {this.state.description ? 'Edit ' : 'Add '} description
          </button>
        </>
      );
    }

    return (
      <div className="labellingComponent">
        {listOfItems && (
          <SelectTree
            columns={2}
            items={listOfItems}
            onSelect={onSelectedCallback}
          />
        )}
        {this.state.label && (
          <div className="selectedLabel">{this.state.label.value}</div>
        )}
        {this.state.description && (
          <div className="selectedDescription">
            {this.state.description.value}
          </div>
        )}

        {buttons}
      </div>
    );
  }

  itemLabelSelected = (event, item) => {
    this.setState({
      label: item
    });
  };

  itemDescriptionSelected = (event, item) => {
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

export default Labelling;
