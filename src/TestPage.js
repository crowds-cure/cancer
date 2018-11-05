import { Component } from 'react';
import React from 'react';
import './TestPage.css';
import { labelItems, descriptionItems } from './labelling/labellingData.js';

import SelectTree from './select-tree/SelectTree.js';

class TestPage extends Component {
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
    let showLabelList = false;
    let showDescriptionList = false;
    let buttons = '';

    if (this.state.label === null) {
      showLabelList = true;
    } else if (this.state.requestDescription) {
      showDescriptionList = true;
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
      <div className="TestPage">
        {showLabelList && (
          <SelectTree
            twoColumns={true}
            items={labelItems}
            value={this.state.label}
            onSelect={this.itemLabelSelected}
          />
        )}
        {showDescriptionList && (
          <SelectTree
            twoColumns={true}
            items={descriptionItems}
            value={this.state.description}
            onSelect={this.itemDescriptionSelected}
          />
        )}
        {this.state.label && <div>{this.state.label.value}</div>}
        {this.state.description && <div>{this.state.description.value}</div>}

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

export default TestPage;
