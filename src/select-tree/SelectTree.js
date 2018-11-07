import { Component } from 'react';
import React from 'react';

import InputRadio from './InputRadio.js';

import './SelectTree.css';

const columnsClassMap = ['', 'col-16', 'col-8', 'col-5', 'col-4', 'col-3'];

class SelectTree extends Component {
  static defaultProps = {
    columns: 2,
    searchEnabled: false,
    items: []
  };

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: null,
      value: null
    };
  }

  render() {
    const treeItems = this.getTreeItems();

    return (
      <div className="select-tree select-tree-root">
        <div className="tree-content container">
          {this.headerItem}
          <div className="tree-options">
            <div className="tree-inputs row">{treeItems}</div>
          </div>
        </div>
      </div>
    );
  }

  isLeafSelected = () =>
    this.state.value !== null && this.state.value !== undefined;

  getTreeItems() {
    const storageKey = 'SelectTree';
    const columnsClass = columnsClassMap[this.props.columns];
    const sortedItems = this.isLeafSelected()
      ? [this.state.value]
      : this.props.items;

    const treeItems = sortedItems.map((item, index) => {
      return (
        <InputRadio
          key={index}
          id={`${storageKey}_${item.value}`}
          name={index}
          itemData={item}
          value={item.value}
          label={item.label}
          labelClass={`tree-leaf ${columnsClass}`}
          onSelected={this.onSelected}
        />
      );
    });

    return treeItems;
  }

  headerItem = (
    <div className="wrapperLabel tree-header row">
      {this.props.searchEnabled === true && (
        <>
          <input
            type="text"
            className="form-control"
            placeholder="Search labels"
          />
          <i className="fa fa-search" />
        </>
      )}
      <div className="wrapperText">{this.props.title}</div>
    </div>
  );

  onSelected = (event, item) => {
    this.setState({
      value: item
    });
    this.props.onSelect(event, item);
  };
}

export default SelectTree;
